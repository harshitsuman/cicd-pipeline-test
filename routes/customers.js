const express = require('express');
const customers = require('../data/customers.json');

const router = express.Router();

// GET /api/customers - fetch all customers
router.get('/', (req, res) => {
  res.json(customers);
});

// GET /api/customers/:id - fetch a customer by id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid customer id' });
  }

  const customer = customers.find((c) => c.id === id);
  if (!customer) {
    return res.status(404).json({ message: `Customer with id ${id} not found` });
  }

  res.json(customer);
});

module.exports = router;
