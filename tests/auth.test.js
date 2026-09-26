const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../app');

test('login succeeds with correct credentials', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'password' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.username, 'admin');
});

test('login fails with wrong password', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'wrong' });
  assert.strictEqual(res.status, 401);
});

test('login fails when fields are missing', async () => {
  const res = await request(app).post('/api/auth/login').send({});
  assert.strictEqual(res.status, 400);
});

test('home page serves the sign-in screen', async () => {
  const res = await request(app).get('/');
  assert.strictEqual(res.status, 200);
  assert.match(res.text, /Sign in/);
});
