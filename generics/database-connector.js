

const pg = require('pg')
// Environment Variables
const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, NODE_ENV } = process.env

const clientConfig = () => {
    if (NODE_ENV == 'production') {
      console.log(`Production Mode ${Date.now()}}`)
      return {
        host: PGHOST,
        dbPort: PGPORT,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        frontEndUri: 'https://www.chikkiaquatics.com'
      }
    } else {
      console.log(`Development Mode ${Date.now()}}`)
      return {
        host: 'localhost',
        dbPort: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'newpassword',
        frontEndUri: 'http://localhost:3000'
      }
    }
  }
  const { host, dbPort, database, user, password, frontEndUri} = clientConfig()
  const pool = new pg.Pool({
    host: host,
    port: dbPort,
    user: user,
    password: password,
    database: database
  })

  module.exports = { pool, host, dbPort, database, user, password, frontEndUri}