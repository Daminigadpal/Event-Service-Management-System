// backend/index.js
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

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/event-preferences", eventPreferenceRoutes);
app.use("/api/v1/staff-availability", staffAvailabilityRoutes);
app.use("/api/v1/event-reminders", eventReminderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/service-packages", servicePackageRoutes); // Added route

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
    // Skip MongoDB connection for now and use in-memory data
    console.log('Starting server without MongoDB connection (for testing)...');
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/v1`);
      console.log('⚠️  MongoDB connection skipped - using in-memory data for testing');
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
  server?.close(() => process.exit(1));
});

// Start the server
startServer();