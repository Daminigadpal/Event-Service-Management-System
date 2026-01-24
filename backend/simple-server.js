// Simple working server - CommonJS version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes
const authRoutes = require('./src/routes/auth.js');
const userRoutes = require('./src/routes/user.js');
const publicUserRoutes = require('./src/routes/publicUserRoutes.js');
const publicBookingRoutes = require('./src/routes/publicBookingRoutes.js');
const serviceRoutes = require('./src/routes/service.js');
const bookingRoutes = require('./src/routes/booking.js');
const eventPreferenceRoutes = require('./src/routes/eventPreferenceRoutes.js');
const staffAvailabilityRoutes = require('./src/routes/staffAvailabilityRoutes.js');
const eventReminderRoutes = require('./src/routes/eventReminderRoutes.js');
const paymentRoutes = require('./src/routes/paymentRoutes.js');
const eventExecutionRoutes = require('./src/routes/eventExecutionRoutes.js');
// const servicePackageRoutes = require('./src/routes/servicePackageRoutes.js');

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://127.0.0.1:5176', 'http://127.0.0.1:5177', 'http://127.0.0.1:61212', 'http://localhost:3000', 'http://127.0.0.1:53640'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma', 'Expires']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', req.body);
  }
  next();
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/public-users", publicUserRoutes);
app.use("/api/v1/public-bookings", publicBookingRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/event-preferences", eventPreferenceRoutes);
app.use("/api/v1/staff-availability", staffAvailabilityRoutes);
app.use("/api/v1/event-reminders", eventReminderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/event-executions", eventExecutionRoutes);
// app.use("/api/v1/service-packages", servicePackageRoutes);

// Public event preferences endpoint for admin dashboard
app.get("/api/v1/public-event-preferences", async (req, res) => {
  try {
    const EventPreference = require('./src/models/EventPreference.js');
    const preferences = await EventPreference.find({}).populate('user', 'name email');
    res.json({
      success: true,
      count: preferences.length,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching event preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/event-management');
    console.log('✅ MongoDB Connected Successfully');
    
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
      console.log('🗄️  MongoDB connected - using real database');
    });
  } catch (error) {
    console.error('❌ Server error:', error);
  }
};

start();
