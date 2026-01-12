require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Middlewares
const authMiddleware = require("./src/middleware/authMiddleware");
const roleMiddleware = require("./src/middleware/roleMiddleware");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const packageRoutes = require("./src/routes/packageRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const staffAvailabilityRoutes = require("./src/routes/staffAvailabilityRoutes");

const app = express();

// ---------- Middlewares ----------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ---------- Database ----------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Error:", err.message));

// ---------- Public Routes ----------
app.use("/api/v1/auth", authRoutes);

// ---------- Protected Routes ----------
app.use("/api/v1/services", authMiddleware, serviceRoutes);
app.use("/api/v1/packages", authMiddleware, packageRoutes);
app.use("/api/v1/customers", authMiddleware, customerRoutes);
app.use("/api/v1/bookings", authMiddleware, bookingRoutes);
app.use("/api/v1/payments", authMiddleware, paymentRoutes);
app.use("/api/v1/staff-availability", authMiddleware, staffAvailabilityRoutes);

// Example role protection (admin only route)
app.get(
  "/api/v1/admin/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

// ---------- Health Check ----------
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
