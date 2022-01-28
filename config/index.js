module.exports = {
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 3,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'I wish Groudon were a lengendary creature card in magic the gathering',
  }