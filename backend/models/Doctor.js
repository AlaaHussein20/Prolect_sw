const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  fees: {
    type: Number,
    required: true
  },
  availableSlots: [{
    date: Date,
    time: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
