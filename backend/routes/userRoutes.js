// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Route to create a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User created successfully!', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
