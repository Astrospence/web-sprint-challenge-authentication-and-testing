const db = require('../data/dbConfig')

const findBy =  (filter) => {
    return db('users').where(filter).first()
}

const insert = async (newUser) => {
    const [id] = await db('users').insert(newUser)
    return findBy({ id })
}

module.exports = {
    findBy,
    insert
}