const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5001;

app.use(cors());

// middleware
app.use(express.json());
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ✅ connect to MongoDB Atlas (use env var if available)
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://alaahussein20_db_user:csci313project@project.sz8j3z2.mongodb.net/';
mongoose.connect(mongoUri)
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  console.error('Please check:');
  console.error('1. Your internet connection');
  console.error('2. MongoDB Atlas credentials');
  console.error('3. IP whitelist settings (add 0.0.0.0/0 for testing)');
});

// test route
app.get('/', (req, res) => {
  res.send('Backend working & connected to MongoDB! 🚀');
});

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
