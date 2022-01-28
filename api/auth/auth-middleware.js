const Db = require('../dbHelpers')

const checkReqBody = (req, res, next) => {
    const { username, password } = req.body
    if(username && password) {
        next()
    } else {
        next({ status: 400, message: 'username and password required' })
    }
}

const checkUsernameExists = async (req, res, next) => {
    const { username } = req.body.username
    const exists = await Db.findBy(username)
    if (exists) {
        next({ status: 409, message: 'username taken' })
    } else {
        next()
    }
}

module.exports = {
    checkReqBody,
    checkUsernameExists
}