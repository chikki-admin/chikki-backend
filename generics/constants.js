const {pool} = require('./database-connector')
const postQuery = (query, res) => {
    return pool.query(query)
        .then((_) => res.sendStatus(200))
        .catch((e) => console.error(e.stack))
  }
const getQuery = (query, res) => {
    return pool.query(query)
        .then((result) => res.send(result.rows))
        .catch((e) => console.error(e.stack))
}
const putQuery = (query, res) => {
    return pool.query(query)
        .then((_) => res.sendStatus(200))
        .catch((e) => console.error(e.stack))
}

module.exports = { postQuery, getQuery, putQuery}
