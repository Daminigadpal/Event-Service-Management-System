// Simple working server - ES Module version
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Routes
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
// import serviceRoutes from './src/routes/service.js';
// import bookingRoutes from './src/routes/booking.js';
// import eventPreferenceRoutes from './src/routes/eventPreferenceRoutes.js';
import staffAvailabilityRoutes from './src/routes/staffAvailabilityRoutes.js';
import eventReminderRoutes from './src/routes/eventReminderRoutes.js';
// import paymentRoutes from './src/routes/paymentRoutes.js';
// import servicePackageRoutes from './src/routes/servicePackageRoutes.js';

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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
// app.use("/api/v1/services", serviceRoutes);
// app.use("/api/v1/bookings", bookingRoutes);
// app.use("/api/v1/event-preferences", eventPreferenceRoutes);
app.use("/api/v1/staff-availability", staffAvailabilityRoutes);
// app.use("/api/v1/event-reminders", eventReminderRoutes);
// app.use("/api/v1/payments", paymentRoutes);
// app.use("/api/v1/service-packages", servicePackageRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
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
