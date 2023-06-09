const {pool} = require('./database-connector');

const postQuery = (query, res) => {
    console.log(`Send Query: ${query.text}`)
    return pool.query(query)
        .then((_) => res.sendStatus(200))
        .catch((e) => console.error(e.stack))
  }
const getQuery = (query, res) => {
    console.log(`Send Query: ${query.text}`)
    return pool.query(query)
        .then((result) => res.send(result.rows))
        .catch((e) => console.error(e.stack))
}
const putQuery = (query, res) => {
    console.log(`Send Query: ${query.text}`)
    return pool.query(query)
        .then((_) => res.sendStatus(200))
        .catch((e) => console.error(e.stack))
}

const deleteQuery = (query, res) => {
    console.log(`Send Query: ${query.text}`)
    return pool.query(query).then((_) => res.sendStatus(200)).catch((e) => console.error(e.stack))
}

const FishStatus = {
    NOT_BOUGHT: 'not_bought',
    SOLD: 'sold',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
}

module.exports = { postQuery, getQuery, putQuery, deleteQuery, FishStatus}
