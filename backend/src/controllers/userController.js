// backend/src/controllers/userController.js
const ErrorResponse = require('../utils/errorResponse.js');
const User = require('../models/User.js');

// Add asyncHandler directly in this file
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access   Private
const updateProfile = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, phone, address, role, department, skills } = req.body;
    
    console.log('Updating profile for user:', req.user.id);
    console.log('Update data:', { name, email, phone, address, role, department, skills });
    
    // Find user in MongoDB
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found with id:', req.user.id);
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
        role: role || user.role,
        department: department || user.department,
        skills: skills || user.skills,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    console.log('Successfully updated user:', updatedUser);
    
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    next(error);
  }
});

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access   Private
const getProfile = asyncHandler(async (req, res, next) => {
  try {
    console.log('Getting profile for user:', req.user.id);
    
    // Find user in MongoDB
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found with id:', req.user.id);
      return next(new ErrorResponse('User not found', 404));
    }
    
    console.log('Found user:', user);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    next(error);
  }
});

// @desc    Create user
// @route   POST /api/v1/users
// @access   Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
  try {
    const newUser = await User.create({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('User created successfully:', newUser);
    
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    next(error);
  }
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access   Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    // Get all users from MongoDB
    const users = await User.find({});
    
    console.log('Found users:', users.length);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    next(error);
  }
});

module.exports = {
  updateProfile,
  getProfile,
  createUser,
  getUsers
};