import User from "../models/User.js";

// Mock user data for testing without MongoDB
const mockUsers = [
  {
    _id: '69607e6cc3465f9a8169107d',
    name: 'Ram',
    email: 'ram@gmail.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 'ram123' hashed
    role: 'user'
  }
];

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//
// @route   POST /api/v1/auth/register
//
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Mock registration - just return success
  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    role: role || 'user'
  };

  res.status(201).json({
    success: true,
    message: "User registered successfully (mock)",
    data: newUser,
  });
});

//
// @route   POST /api/v1/auth/login
//
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password });

  // Validate
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Please provide email and password",
    });
  }

  // Mock user check
  const user = mockUsers.find(u => u.email === email);
  console.log('User found:', user ? 'Yes' : 'No');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }

  // Mock password check (for ram@gmail.com, password should be 'ram123')
  if (email === 'ram@gmail.com' && password !== 'ram123') {
    return res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  }

  // Generate proper JWT token
  const jwt = await import('jsonwebtoken');
  const token = jwt.default.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.status(200).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

//
// @route   GET /api/v1/auth/me
//
export const getMe = asyncHandler(async (req, res) => {
  // Mock user data
  const user = mockUsers[0]; // Return the mock user

  res.status(200).json({
    success: true,
    data: user,
  });
});

//
// @route   GET /api/v1/auth/logout
//
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});