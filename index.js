require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Middlewares
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const packageRoutes = require("./routes/packageRoutes");
const customerRoutes = require("./routes/customerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

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
app.use("/api/auth", authRoutes);

// ---------- Protected Routes ----------
app.use("/api/services", authMiddleware, serviceRoutes);
app.use("/api/packages", authMiddleware, packageRoutes);
app.use("/api/customers", authMiddleware, customerRoutes);
app.use("/api/bookings", authMiddleware, bookingRoutes);
app.use("/api/payments", authMiddleware, paymentRoutes);

// Example role protection (admin only route)
app.get(
  "/api/admin/dashboard",
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
