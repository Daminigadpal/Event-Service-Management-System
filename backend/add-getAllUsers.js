// backend/src/controllers/userController.js - Add getAllUsers function

const getAllUsers = asyncHandler(async (req, res, next) => {
  console.log('DEBUG: getAllUsers called');
  console.log('DEBUG: req.user:', req.user);

  try {
    // Get all users from database
    const users = await User.find({}).select('-password'); // Exclude password field
    console.log('DEBUG: Found users:', users.length);
    
    // Format user data
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'General',
      createdAt: user.createdAt,
      phone: user.phone || '',
      address: user.address || ''
    }));

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: formattedUsers,
      count: formattedUsers.length
    });

  } catch (error) {
    console.error('DEBUG: Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
});

// Add this to the module.exports
module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  getAllUsers, // Add this new function
  deleteProfile
};
