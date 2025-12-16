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
    const { name, specialization, email, phone, fees, availableSlots } = req.body;
    const update = { name, specialization, email, phone, fees };
    if (Array.isArray(availableSlots)) {
      update.availableSlots = availableSlots;
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      update,
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

// 🟢 Update doctor availability slots
router.put('/:id/slots', async (req, res) => {
  try {
    const { availableSlots } = req.body;
    if (!Array.isArray(availableSlots)) {
      return res.status(400).json({ message: 'availableSlots must be an array' });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availableSlots },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Availability updated successfully', doctor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
