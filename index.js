// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

// Import routes from root routes directory
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./src/routes/bookingRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

// Import routes from src/routes directory
const serviceRoutes = require('./src/routes/serviceRoutes');
const userRoutes = require('./src/routes/userRoutes');
const deliverableRoutes = require('./src/routes/deliverableRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const packageRoutes = require('./src/routes/packageRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');


// Then use it like this:



// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/deliverables', deliverableRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/schedules', scheduleRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Server Error' 
  });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});