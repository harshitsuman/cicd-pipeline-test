const express = require('express');
const customerRoutes = require('./routes/customers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console -- startup message is intentional
  console.log(`Server running on http://localhost:${PORT}`);
});
