const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

test('NODE_ENV is correct', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('POST /api/auth', () => {
  test('call to /register responds with a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'foobar', password: '1234' })
    expect(res.body.id).toBe(1)
    expect(res.body.username).toBe('foobar')
    expect(res.body.password).toBeTruthy()
  })

  test('call to /register responds with status 201', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'foobarz', password: '1234' })
    expect(res.status).toBe(201)
  })

  test('call to /register not providing username or password sends appropriate error messages', async () => {
    let res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'foobar' })
    expect(res.body.message).toBe('username and password required')
    res = await request(server)
      .post('/api/auth/register')
      .send({ password: '1234' })
    expect(res.body.message).toBe('username and password required')
    res = await request(server)
      .post('/api/auth/register')
      .send({})
    expect(res.body.message).toBe('username and password required')
  })

  test('call to /login responds with a token', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'foobar', password: '1234' })
    expect(res.body.token).toBeTruthy()
  })

  test('call to /login not providing username or password sends appropriate error messages', async () => {
    let res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'foobar' })
    expect(res.body.message).toBe('username and password required')
    res = await request(server)
      .post('/api/auth/login')
      .send({ password: '1234' })
    expect(res.body.message).toBe('username and password required')
    res = await request(server)
      .post('/api/auth/login')
      .send({})
    expect(res.body.message).toBe('username and password required')
  })
})

describe('GET /api/jokes', () => {
  test('call to /jokes without a token sends appropriate error message', async () => {
    const res = await request(server)
      .get('/api/jokes')
    expect(res.body.message).toBe('token required')
  })

  test('call to /jokes with an invalid token sends appropriate error message', async () => {
    const res = await request(server)
      .get('/api/jokes')
      .set('Authorization', 'foo')
    expect(res.body.message).toBe('token invalid')
  })

  test('call to /jokes with a valid token returns the jokes', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'testing', password: 'token' })
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'testing', password: 'token' })
    const token = res.body.token
    const getRes = await request(server)
      .get('/api/jokes')
      .set('Authorization', token)
    expect(getRes.body[0]).toBeDefined()
  })
})
