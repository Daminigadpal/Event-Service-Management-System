const mongoose = require('mongoose');
const User = require('./src/models/User.js');

// Check user roles
const checkUserRoles = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
    
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('✅ User Details:');
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Department:', user.department);
    console.log('  Created:', user.createdAt);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

checkUserRoles();
