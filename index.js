const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console -- startup message is intentional
  console.log(`Server running on http://localhost:${PORT}`);
});
