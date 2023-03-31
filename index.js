const express = require('express')
const pg = require('pg')
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 8000
const stripe_key = process.env.STRIPE_SECRETE_KEY_TEST
const stripe = require('stripe')(stripe_key)



// Middleware
app.use(bodyParser.json())
app.use(cors())

// Environment Variables
const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD,
  INTERNALUSERNAME, INTERNALPASSWORD, STREAM_PATH, NODE_ENV } = process.env
// Clients
const clientConfig = () => {
  if (NODE_ENV == 'production') {
    console.log(`Production Mode ${Date.now()}}`)
    return {
      host: PGHOST,
      dbPort: PGPORT,
      database: PGDATABASE,
      user: PGUSER,
      password: PGPASSWORD,
      internalUser: INTERNALUSERNAME,
      interalPassword: INTERNALPASSWORD
    }
  } else {
    console.log(`Development Mode ${Date.now()}}`)
    return {
      host: 'localhost',
      dbPort: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'newpassword',
      internalUser: 'test',
      interalPassword: 'test'
    }
  }
}
const { host, dbPort, database, user, password, internalUser, interalPassword } = clientConfig()
const pool = new pg.Pool({
  host: host,
  port: dbPort,
  user: user,
  password: password,
  database: database
})
pool.connect().catch((e) => console.error(e.stack))

// Local Functions
const postQuery = (query, res) => {
  pool.query(query)
  .then((_) => res.sendStatus(200))
  .catch((e) => console.error(e.stack))
}
const getQuery = (query, res) => {
  pool.query(query)
  .then((result) => res.send(result.rows))
  .catch((e) => console.error(e.stack))
}
const putQuery = (query, res) => {
  pool.query(query)
  .then((_) => res.sendStatus(200))
  .catch((e) => console.error(e.stack))
}

// Routes
app.post('/fish', (req, res) => {
  const {name, price, origin, s3Source, description, username, password} = req.body
  if (username !== internalUser || password !== interalPassword) {
    res.sendStatus(403)
    return
  }
  const query = {
    text: 'INSERT INTO fish_inventory \
    (id, fish_name, origin, price, bought, display, image_source, description) \
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    values: [uuidv4(), name, origin, price, false, true, s3Source, description],
  }
  postQuery(query, res)
})

app.put(`/fish/:id`, (req, res) => {
  const {id} = req.params
  const query = {
    text: 'UPDATE fish_inventory SET bought = true WHERE id = $1',
    values: [id],
  }
  putQuery(query, res)
})


app.get('/fish', (_, res) => {
  const query = {
    text: 'SELECT * FROM fish_inventory',
  }
  getQuery(query, res)
})

app.get('/livestream', (_, res) => {
  return res.send(STREAM_PATH)
})

app.get('/status', (req, res) => {
  res.send('OK')
})

app.post('/create-checkout-session', async (_, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel'
  });

  res.json({url: session.url})
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})