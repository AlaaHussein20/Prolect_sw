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

module.exports = router;
