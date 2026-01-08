// backend/src/controllers/userController.js
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

// Add asyncHandler directly in this file
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res, next) => {
  try {
    console.log('Updating profile for user:', req.user.id);
    console.log('Request body:', req.body);

    const { name, email, phone, address } = req.body;
    const updateObj = {};
    if (name !== undefined) updateObj.name = name;
    if (email !== undefined) updateObj.email = email;
    if (phone !== undefined) updateObj.phone = phone;
    if (address !== undefined) updateObj.address = address;

    console.log('Update object:', updateObj);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateObj },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.log('User not found with id:', req.user.id);
      return next(new ErrorResponse('User not found', 404));
    }

    console.log('Successfully updated user:', user);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return next(new ErrorResponse(messages, 400));
    }
    return next(new ErrorResponse(error.message || 'Server error', 500));
  }
});

// Add other user controller methods here, each using the same asyncHandler
// For example:
export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  res.status(200).json({ success: true, data: user });
});