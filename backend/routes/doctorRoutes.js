const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// 🟢 إضافة دكتور جديد
router.post('/add', async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully!', doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 عرض كل الدكاترة
//
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get doctor by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get a specific doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Update doctor profile
router.put('/:id', async (req, res) => {
  try {
    const { name, specialization, email, phone, fees } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, specialization, email, phone, fees },
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor profile updated successfully', doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
