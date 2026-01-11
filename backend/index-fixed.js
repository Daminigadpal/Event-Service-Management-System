// backend/index.js - FIXED VERSION
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import authRoutes from "./src/routes/auth.js";
import userRoutes from "./src/routes/user.js";
import serviceRoutes from "./src/routes/service.js";
import bookingRoutes from "./src/routes/booking.js";
import eventPreferenceRoutes from "./src/routes/eventPreferenceRoutes.js";
import staffAvailabilityRoutes from "./src/routes/staffAvailabilityRoutes.js";
import eventReminderRoutes from "./src/routes/eventReminderRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import servicePackageRoutes from "./src/routes/servicePackageRoutes.js";

// Load environment variables FIRST
dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Request logging middleware
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
  
  if (err.statusCode) {
    res.status(err.statusCode).json({ 
      success: false, 
      error: err.message 
    });
  } else {
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
    await mongoose.connect('mongodb://localhost:27017/event_management');
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
  process.exit(1);
});

// Start the server
startServer();
