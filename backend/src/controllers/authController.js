const User = require("../models/User.js");
const jwt = require('jsonwebtoken');

// Mock users for testing without MongoDB
const mockUsers = [
  {
    _id: 'mock_staff_1',
    name: 'Staff Member',
    email: 'staff@gmail.com',
    password: 'staff123',
    role: 'staff',
    department: 'Event Management',
    skills: ['Photography', 'Event Setup']
  },
  {
    _id: 'mock_admin_1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    skills: ['Management']
  }
];

// Async handler
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//
// @route   POST /api/v1/auth/register
//
const register = asyncHandler(async (req, res) => {
   const { name, email, password, role } = req.body;

   console.log('🔥 Registration attempt received:', { name, email, role });

   // Validate input
   if (!name || !email || !password) {
     console.log('❌ Validation failed: missing name, email, or password');
     return res.status(400).json({
       success: false,
       error: "Please provide name, email, and password",
     });
   }

   try {
     console.log('🔍 Checking if user exists...');
     // Check if user already exists in MongoDB
     const existingUser = await User.findOne({ email });
     console.log('👤 Existing user check result:', existingUser ? 'Found' : 'Not found');
     if (existingUser) {
       console.log('❌ User already exists');
       return res.status(400).json({
         success: false,
         error: "User with this email already exists",
       });
     }

     console.log('👤 Creating new user...');
     // Create new user in MongoDB
     const newUser = await User.create({
       name,
       email,
       password, // This will be hashed by User model pre-save hook
       role: role || 'user',
       department: role === 'event_manager' ? 'Event Management' : 'General',
       skills: role === 'event_manager' ? ['Event Management', 'Planning'] : [],
       phone: '',
       address: ''
     });

     console.log('✅ User created successfully:', {
       id: newUser._id,
       name: newUser.name,
       email: newUser.email,
       role: newUser.role
     });

     res.status(201).json({
       success: true,
       message: "User registered successfully",
       data: {
         id: newUser._id,
         name: newUser.name,
         email: newUser.email,
         role: newUser.role,
         department: newUser.department,
         skills: newUser.skills
       }
     });
   } catch (error) {
     console.error('❌ Registration error:', error.message);
     console.error('📋 Full error:', error);
     return res.status(500).json({
       success: false,
       error: "Server error during registration"
     });
   }
 });

//
// @route   POST /api/v1/auth/login
//
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('🔍 Login attempt received:', { email, password: '***' });
  console.log('📧 Email:', email);
  console.log('🔑 Password length:', password ? password.length : 'none');

  // Validate
  if (!email || !password) {
    console.log('❌ Missing email or password');
    return res.status(400).json({
      success: false,
      error: "Please provide email and password",
    });
  }

  try {
    // Check user in MongoDB
    console.log('🔍 Checking user in database...');
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    console.log('✅ User found:', user.name);

    // Check password
    console.log('🔐 Checking password...');
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    console.log('✅ Password matched');

    // Generate JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
    console.log('🎫 Token generated successfully');

    console.log('✅ Login successful for:', user.name, 'Role:', user.role);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        skills: user.skills
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    console.error('📋 Full error:', error);
    console.error('📋 Error stack:', error.stack);
    return res.status(500).json({
      success: false,
      error: "Server error during login"
    });
  }
});

//
// @route   GET /api/v1/auth/me
//
const getMe = asyncHandler(async (req, res) => {
  // Get user ID from token (this should be set by auth middleware)
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "User not authenticated",
    });
  }

  try {
    // Find user in MongoDB
    const user = await User.findById(userId).select('-password');
  
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching profile"
    });
  }
});

//
// @route   GET /api/v1/auth/logout
//
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout
};