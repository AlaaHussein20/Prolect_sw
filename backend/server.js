const express = require('express');
const app = express();
const PORT = 5000;

// middleware to handle JSON data
app.use(express.json());

// sample route
app.get('/', (req, res) => {
  res.send('Backend working! 🚀');
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
