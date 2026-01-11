// backend/index.cjs - CommonJS version
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./src/routes/auth.js");
const userRoutes = require("./src/routes/user.js");
const serviceRoutes = require("./src/routes/service.js");
const bookingRoutes = require("./src/routes/booking.js");
const eventPreferenceRoutes = require("./src/routes/eventPreferenceRoutes.js");
const staffAvailabilityRoutes = require("./src/routes/staffAvailabilityRoutes.js");
const eventReminderRoutes = require("./src/routes/eventReminderRoutes.js");
const paymentRoutes = require("./src/routes/paymentRoutes.js");
const servicePackageRoutes = require("./src/routes/servicePackageRoutes.js");

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
}));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  console.log('📋 Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', req.body);
  }
  next();
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/event-preferences", eventPreferenceRoutes);
app.use("/api/v1/staff-availability", staffAvailabilityRoutes);
app.use("/api/v1/event-reminders", eventReminderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/service-packages", servicePackageRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // If it's an ErrorResponse with a specific status code, use that
  if (err.statusCode) {
    res.status(err.statusCode).json({ 
      success: false, 
      error: err.message 
    });
  } else {
    // Default to 500 for other errors
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// MongoDB connection and server start
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event_management');
    console.log('✅ MongoDB Connected Successfully');
    
    // FORCE PORT 5000 - ignore .env
    const PORT = 5000;
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api/v1`);
      console.log('🗄️  MongoDB connected - using real database');
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (err) {
    console.error('Server startup error:', err.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  if (server && typeof server.close === 'function') {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Start the server
startServer();
