const path = require('path');
const express = require('express');
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);

module.exports = app;
