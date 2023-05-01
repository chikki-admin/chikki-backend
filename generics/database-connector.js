

const pg = require('pg')
const fs = require('fs')
// Environment Variables
const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, NODE_ENV } = process.env

const clientConfig = () => {
  if (NODE_ENV == 'production') {
    console.log(`Production Mode ${Date.now()}`)
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
const connectToDatabase = () => {
  try{
    const pool = new pg.Pool({
      host: host,
      port: dbPort,
      user: user,
      password: password,
      database: database,
      ssl: {
        ca: fs
          .readFileSync("/etc/ssl/certs/rds-ca-2019-root.pem")
          .toString()
      }
    })
    console.log(`Connected to ${host}:${dbPort}/${database} as ${user}`)
    return pool
  }
  catch (e) {
    console.error(e.stack)
  }
}
const pool = connectToDatabase()

module.exports = { pool, host, dbPort, database, user, password, frontEndUri}