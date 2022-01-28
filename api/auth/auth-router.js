const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('../../config')
const makeToken = require('./auth-token-builder')
const router = require('express').Router();
const Db = require('../dbHelpers')
const { checkReqBody, checkUsernameExists } = require('./auth-middleware')


router.post('/register', checkReqBody, checkUsernameExists, (req, res, next) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)
  user.password = hash
  console.log(user)

  Db.insert(user)
    .then(response => {
      res.status(201).json(response)
    })
    .catch(next)
});

router.post('/login', checkReqBody, (req, res, next) => {
  let { username, password } = req.body

  Db.findBy({ username })
    .then(response => {
      if (!response || !bcrypt.compareSync(password, response.password)) {
        next({ status: 401, message: 'invalid credentials' })
      } else {
        const token = makeToken(response)
        res.status(200).json({ message: `welcome, ${response.username}`, token })
      }
    })
});

module.exports = router;
