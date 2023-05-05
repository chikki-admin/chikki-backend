const express = require('express')
const { postQuery } = require('../generics/constants')
const { pool } = require('../generics/database-connector')
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('../generics/confimation-email');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY || "myawesomesecretkey";

// define middleware function
const authenticateToken = (req, res, next) => {
  // get the token from the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // if there is no token, return an error
    return res.status(401).send('Unauthorized');
  }

  // verify the token using the secret key
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // if there is an error, return an error
      return res.status(403).send('Forbidden');
    }

    // add the user object to the request object
    req.user = user;

    // call the next middleware function
    next();
  });
}

const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
}


const authorizationRouters = express.Router()

authorizationRouters.get('/seller/:sellerId', async (_, res) => {
  const {sellerId} = req.params
    const query = {
        text: 'SELECT * FROM users where id = $1',
        values: [sellerId],
    }
    result = await pool.query(query)
    res.status(200).send({seller: result.rows})
})


authorizationRouters.post('/login', async (req, res) => {
  const {email, password} = req.body
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  }
  result = await pool.query(query)
  user = result.rows[0]
  if (user.password === password & user.verified) {
    const token = jwt.sign(user, secretKey);
    res.status(200).send({token, userId : user.id})
  } else {
    res.status(403).send({message: "Either wrong password or email has not been verified"})
  }
})

authorizationRouters.post('/', async (req, res) => {
    const {email, password} = req.body
    const verificationCode = generateVerificationCode()
    const query = {
        text: 'INSERT INTO users (id, email, password, verified, verification_code) VALUES ($1, $2, $3, $4, $5)',
        values: [ uuidv4(),email, password, false, verificationCode],
    }
    postQuery(query, res)
    await sendEmail(email, verificationCode)
})

module.exports = {
    authorizationRouters,
    authenticateToken
}