const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// 🟢 حجز موعد جديد
router.post('/book', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization fees');

    res.status(201).json({ message: 'Appointment booked!', appointment: populated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 عرض كل المواعيد
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization fees');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get appointments for a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization fees')
      .sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟠 Cancel appointment
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status: 'canceled' },
      { new: true }
    )
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization fees');

    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment canceled', appointment: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
