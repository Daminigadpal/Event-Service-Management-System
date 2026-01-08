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

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/event-preferences", eventPreferenceRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

// MongoDB connection and server start
const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Connecting to MongoDB...');
    
    // Simple connection without options
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/v1`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (err) {
    console.error('Server startup error:', err.message);
    
    // More specific error messages
    if (err.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('Error: Could not resolve the MongoDB hostname. Please check your MONGODB_URI');
    } else if (err.message.includes('bad auth')) {
      console.error('Error: Authentication failed. Please check your MongoDB credentials');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('Error: Could not connect to MongoDB. Make sure MongoDB is running and accessible');
    }
    
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