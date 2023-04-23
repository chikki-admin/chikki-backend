const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 8000
const stripe_key = 'sk_test_51MrE0PJN8JLDL0ga0Xt2I9zDq8v2mrRNPfDFahHXPAGOvdnIw5Z1V3FrjW1y0adrsRV8zGnWGw6ouyU5GWo6ExIm00gupXlgzt'
const stripe = require('stripe')(stripe_key)
const { postQuery, getQuery, putQuery, deleteQuery, FishStatus } = require('./generics/constants')
const { pool, host, dbPort, database, user, password, frontEndUri} = require('./generics/database-connector')
const { authorizationRouters, authenticateToken } = require('./apis/authorizations')



// Middleware
app.use(bodyParser.json())
app.use(cors())

// Local constants
const shippingCost = 52
// Clients
pool.connect().catch((e) => console.error(e.stack))

// Routes
app.post('/fish', authenticateToken, (req, res) => {
  const {name, price, origin, s3Source, description, username, password, sellerId} = req.body
  const query = {
    text: 'INSERT INTO fish_inventory \
    (id, fish_name, origin, price, status, display, image_source, description, seller_id) \
    VALUES($1, $2, $3, $4, $5, $6, $7, $8 ,$9)',
    values: [uuidv4(), name, origin, price, FishStatus.NOT_BOUGHT, true, s3Source, description, sellerId],
  }
  postQuery(query, res)
})

app.post(`/fish/:sessionId`, async (req, res) => {
  const {sessionId} = req.params
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const fishId = session.metadata.fishId
  if(session.payment_status === 'paid') {
    const query = {
      text: `UPDATE fish_inventory SET status = ${FishStatus.SOLD} WHERE id = $1`,
      values: [fishId],
    }
    putQuery(query, res)
  }
})

app.get('/fish/:id', (req, res) => {
  const query = {
    text: 'SELECT status FROM fish_inventory WHERE id = $1',
    values: [req.params.id],
  }
  getQuery(query, res)
})

app.get('/fish', (_, res) => {
  const query = {
    text: 'SELECT * FROM fish_inventory',
  }
  getQuery(query, res)
})

app.get('/fish/pagination/:offSet', async (req, res) => {
  await new Promise(r => setTimeout(r, 3000));
  console.log('/fish/pagination/:offSet')
  const {offSet} = req.params
  const query = {
    text: `
      SELECT fish_inventory.*, users.seller_name
      FROM fish_inventory 
      INNER JOIN users
      ON fish_inventory.seller_id = users.id
      LIMIT 3 OFFSET $1`,
    values: [offSet],
  }
  getQuery(query, res)
})

app.get('/seller/:sellerId/fish', (req, res) => {
  const sellerId = req.params.sellerId
  const query = {
    text: 'SELECT * FROM fish_inventory WHERE seller_id = $1',
    values: [sellerId],
  }
  getQuery(query, res)
})

app.delete('/fish/:fishId', authenticateToken, (req, res) => {
  const { fishId } = req.params
  console.log(fishId)
  const query = {
    text: 'DELETE FROM fish_inventory WHERE id = $1',  
    values: [fishId],
  }
  deleteQuery(query, res)
})

app.get('/status', (req, res) => {
  res.send('OK')
})

app.post('/create-checkout-session', async (req, res) => {
  const {fishId, fishPrice, fishName, imgSource} = req.body
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Fish - ${fishName} and shipping cost of ${shippingCost}$`,
            images: [],
          },
          unit_amount: parseInt(fishPrice)*100,
        },
        quantity: 1
      },
    ],
    metadata: {
      'fishId': fishId,
    },
    mode: 'payment',
    success_url: `${frontEndUri}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontEndUri}`
  });

  res.json({url: session.url})
});

// Add authorization routes
app.use('/auth', authorizationRouters)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})