// backend/src/controllers/userController.js
import ErrorResponse from '../utils/errorResponse.js';

// Add asyncHandler directly in this file
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Mock user data for testing without MongoDB
let mockUsers = [
  {
    _id: '69607e6cc3465f9a8169107d',
    name: 'Ram',
    email: 'ram@gmail.com',
    phone: '12345678',
    address: '',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access   Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    
    console.log('Updating profile for user:', req.user.id);
    console.log('Update data:', { name, email, phone, address });
    
    // Find user in mock data
    const userIndex = mockUsers.findIndex(user => user._id === req.user.id);
    
    if (userIndex === -1) {
      console.log('User not found with id:', req.user.id);
      return next(new ErrorResponse('User not found', 404));
    }
    
    // Update user in mock data
    const updatedUser = {
      ...mockUsers[userIndex],
      name: name || mockUsers[userIndex].name,
      email: email || mockUsers[userIndex].email,
      phone: phone || mockUsers[userIndex].phone,
      address: address || mockUsers[userIndex].address,
      updatedAt: new Date()
    };
    
    mockUsers[userIndex] = updatedUser;
    
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
export const getProfile = asyncHandler(async (req, res, next) => {
  try {
    console.log('Getting profile for user:', req.user.id);
    
    // Find user in mock data
    const user = mockUsers.find(user => user._id === req.user.id);
    
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
export const createUser = asyncHandler(async (req, res, next) => {
  try {
    const newUser = {
      _id: `user_${Date.now()}`,
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockUsers.push(newUser);
    
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
export const getUsers = asyncHandler(async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: mockUsers.length,
      data: mockUsers
    });
  } catch (error) {
    console.error('Error getting users:', error);
    next(error);
  }
});