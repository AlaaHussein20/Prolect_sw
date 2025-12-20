const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Configure CORS for frontend (localhost + Netlify production)
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',      // Local development
      'http://localhost:5001',      // Local backend
      'https://vezeeto.netlify.app', // Your Netlify URL (add this explicitly!)
      process.env.FRONTEND_URL,     // Production Netlify URL from env
    ].filter(Boolean); // Remove undefined values
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// middleware
app.use(express.json());
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ✅ connect to MongoDB Atlas (use env var if available)
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://alaahussein20_db_user:csci313project@project.sz8j3z2.mongodb.net/';
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

  console.log('Allowed CORS origins:', corsOptions.origin);
// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
