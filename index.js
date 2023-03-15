const express = require('express')
const pg = require('pg')
const cors = require('cors')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 8000


// Middleware
app.use(bodyParser.json())
app.use(cors())

// Environment Variables
const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD } = process.env
const { NODE_ENV } = process.env
// Clinets
const clientConfig = () => {
  if (NODE_ENV === 'production') {
    return {
      host: PGHOST,
      dbPort: PGPORT,
      database: PGDATABASE,
      user: PGUSER,
      password: PGPASSWORD,
    }
  } else {
    return {
      host: 'localhost',
      dbPort: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'new_password',
    }
  }
}
const { host, dbPort, database, user, password } = clientConfig()
const pool = new pg.Pool({
  host: host,
  port: dbPort,
  user: user,
  password: password,
  database: database
})
pool.connect()

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

// Routes
app.post('/fish', (req, res) => {
  const {name, price, origin} = req.body
  const query = {
    text: 'INSERT INTO fish_inventory \
    (id, fish_name, origin, price, bought, display, image_source) \
    VALUES($1, $2, $3, $4, $5, $6, $7)',
    values: [uuidv4(), name, origin, price, false, true, 's3://fish-images/placeholder.png'],
  }
  postQuery(query, res)
})

app.get('/fish', (_, res) => {
  const query = {
    text: 'SELECT * FROM fish_inventory',
  }
  getQuery(query, res)
})

app.get('/status', (req, res) => {
  res.send('OK')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})