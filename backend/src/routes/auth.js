const express = require('express');
const { login, register, getMe, logout } = require('../controllers/authController.js');
const { protect } = require("../middleware/auth.js");

const router = express.Router();

// 🔓 Public routes
router.post("/login", login);
router.post("/register", register);
// role comes from request body: user | staff | admin

// 🔐 Protected routes
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);

module.exports = router;
