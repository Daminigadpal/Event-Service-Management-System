require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Middlewares
const { protect } = require("./src/middleware/auth.js");
const roleMiddleware = require("./src/middleware/roleMiddleware");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const eventPreferenceRoutes = require("./src/routes/eventPreferenceRoutes");
const userRoutes = require("./src/routes/user");
// Enable essential routes first
// const serviceRoutes = require("./src/routes/serviceRoutes");
// const packageRoutes = require("./src/routes/packageRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const bookingRoutes = require("./src/routes/booking");
// const paymentRoutes = require("./src/routes/paymentRoutes");
// const staffAvailabilityRoutes = require("./src/routes/staffAvailabilityRoutes");

const app = express();

// ---------- Middlewares ----------
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'cache-control', 'x-requested-with']
}));
app.use(express.json());
app.use(morgan("dev"));

// Handle preflight requests for all routes
app.options('*', cors());

// ---------- Database ----------
// Connect to MongoDB for real data
mongoose
  .connect('mongodb://127.0.0.1:27017/event_management')
  .then(() => console.log("✅ MongoDB Connected - Real Data Available"))
  .catch((err) => console.error("❌ DB Error:", err.message));

// ---------- Public Routes ----------
app.use("/api/v1/auth", authRoutes);

// Public users endpoint for admin dashboard
app.get("/api/v1/public-users", async (req, res) => {
  try {
    // Get real users from database
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({}).toArray();
    
    res.json({ 
      success: true,
      count: users.length,
      data: users.map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department || 'General',
        skills: u.skills || [],
        phone: u.phone || '',
        address: u.address || '',
        createdAt: u.createdAt || new Date(),
        updatedAt: u.updatedAt || new Date()
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Public bookings endpoint for admin dashboard
app.get("/api/v1/public-bookings", async (req, res) => {
  try {
    // Get real bookings from database
    const db = mongoose.connection.db;
    
    // Check if bookings collection exists
    const collections = await db.listCollections().toArray();
    const bookingsCollectionExists = collections.some(c => c.name === 'bookings');
    
    if (bookingsCollectionExists) {
      const bookings = await db.collection('bookings').find({}).toArray();
      res.json({ 
        success: true,
        count: bookings.length,
        data: bookings
      });
    } else {
      // No bookings collection exists
      res.json({ 
        success: true,
        count: 0,
        data: [],
        message: "No bookings found in database - bookings collection doesn't exist"
      });
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Public event preferences endpoint to show real data
app.get("/api/v1/public-event-preferences", async (req, res) => {
  try {
    // Get real event preferences from database
    const db = mongoose.connection.db;
    const eventPrefs = await db.collection('eventpreferences').find({}).toArray();
    
    // Populate user information
    const users = await db.collection('users').find({}).toArray();
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = {
        name: user.name,
        email: user.email
      };
    });
    
    const preferencesWithUsers = eventPrefs.map(pref => ({
      ...pref,
      user: userMap[pref.user?.toString()] || { name: 'Unknown', email: 'unknown@example.com' }
    }));
    
    res.json({ 
      success: true,
      count: preferencesWithUsers.length,
      data: preferencesWithUsers
    });
  } catch (error) {
    console.error('Error fetching event preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- Protected Routes ----------
// app.use("/api/v1/services", protect, serviceRoutes);
// app.use("/api/v1/packages", protect, packageRoutes);
app.use("/api/v1/customers", protect, customerRoutes);
app.use("/api/v1/bookings", protect, bookingRoutes);
app.use("/api/v1/users", protect, userRoutes);
// app.use("/api/v1/payments", protect, paymentRoutes);
// app.use("/api/v1/staff-availability", protect, staffAvailabilityRoutes);
app.use("/api/v1/event-preferences", protect, eventPreferenceRoutes);

// Example role protection (admin only route)
app.get(
  "/api/v1/admin/dashboard",
  protect,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ---------- Test Endpoint ----------
app.get("/api/v1/test", async (req, res) => {
  try {
    // Simple test without database
    res.json({ 
      message: "Server is working", 
      timestamp: new Date().toISOString(),
      status: "OK"
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
