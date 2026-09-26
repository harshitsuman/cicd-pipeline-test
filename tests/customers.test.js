const test = require('node:test');
const assert = require('node:assert');
const customers = require('../data/customers.json');

test('there are 10 customers', () => {
  assert.strictEqual(customers.length, 10);
});

test('every customer has an id and a name', () => {
  for (const c of customers) {
    assert.ok(c.id);
    assert.ok(c.name);
  }
});
