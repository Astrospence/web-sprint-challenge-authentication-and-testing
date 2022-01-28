const db = require('../data/dbConfig')

const findBy = (username) => {
    return db('users').where(username).first()
}

const insert = async (newUser) => {
    const [id] = await db('users').insert(newUser)
    return db('users').where(id).first()
}

module.exports = {
    insert,
    findBy
}