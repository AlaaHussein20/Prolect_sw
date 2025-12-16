// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// ✅ Route to create a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, specialization, phone, fees } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    // If registering as a doctor, create a doctor profile
    let doctorProfile = null;
    if (role === 'doctor') {
      const Doctor = require('../models/Doctor');
      doctorProfile = new Doctor({
        userId: user._id,
        name,
        email,
        specialization: specialization || 'General',
        phone: phone || '',
        fees: fees || 0,
        availableSlots: []
      });
      await doctorProfile.save();
    }

    res.status(201).json({
      message: 'User created successfully!',
      user,
      doctorProfile
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user info and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
