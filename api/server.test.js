const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

test('Sanity Check', () => {
  expect(true).toBe(true)
})

beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('[POST] /api/auth/register (Creates New User)', () => {
  it('should return status code 201', async () => {

    const res = await request(server)
        .post('/api/auth/register')
        .send({username: 'Omi Space', password: 'Mars29'})

    expect(res.status).toBe(201)
  })

  it('Returns new created user with hashed password', async () => {

    const res = await request(server)
        .post('/api/auth/register')
        .send({username: 'Omi Space', password: '12'})

    expect(res.body).toHaveProperty('username', 'Omi Space')
    expect(res.body).not.toMatchObject({username: 'Omi Space', password: '12'})

  })

  it('Returns status code 400 when username || password is missing', async () => {

    const res = await request(server)
        .post('/api/auth/register')
        .send({username: '', password: '12'})

    expect(res.status).toBe(400)

  })

})

describe('[POST] /api/auth/login (Able To Login!)', () => {

  it('Responds w/ status code 200 when login is successful', async () => {

    await request(server)
        .post('/api/auth/register')
        .send({username: 'Sheriff Woody', password:'SnakeInBoot'})

    const res = await request(server)
        .post('/api/auth/login')
        .send({username: 'Sheriff Woody', password: 'SnakeInBoot'})

    expect(res.status).toBe(200)

  })

  it('Sends back Token upon successful login', async () => {

    await request(server)
        .post('/api/auth/register')
        .send({username: 'Sheriff Woody', password: 'SnakeInBoot'})

    const res = await request(server)
        .post('/api/auth/login')
        .send({username: 'Sheriff Woody', password: 'SnakeInBoot'})

    expect(res.body).toHaveProperty('token')

  })

  it('Responds w/ status code 401 if the username does not exist', async () => {

    const res = await request(server)
        .post('/api/auth/login')
        .send({username: 'Buzz', password: 'SpaceRanger000'})

    expect(res.status).toBe(401)

  })

})

