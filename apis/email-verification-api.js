const express = require('express')

const { pool } = require('../generics/database-connector')


const emailVerificationRouters = express.Router()

emailVerificationRouters.get('/verify/:uniqueString', async (req, res) => {
    const {uniqueString} = req.params
    const query = {
        text: 'UPDATE users SET verified = true WHERE verification_code = $1',
        values: [uniqueString],
    }
    result = pool.query(query).then((_) => res.sendStatus(200)).catch((e) => console.error(e.stack))
    }
)

module.exports = { emailVerificationRouters }