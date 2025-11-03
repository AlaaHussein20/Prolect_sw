const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

// middleware
app.use(express.json());

// ✅ connect to MongoDB
mongoose.connect('mongodb://localhost:27017/vezeeta_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// test route
app.get('/', (req, res) => {
  res.send('Backend working & connected to MongoDB! 🚀');
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
