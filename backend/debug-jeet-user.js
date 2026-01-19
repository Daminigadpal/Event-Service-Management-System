const mongoose = require('mongoose');
const User = require('./src/models/User.js');

const debugJeetUser = async () => {
  try {
    console.log('🔍 Connecting to database...');
    await mongoose.connect('mongodb://127.0.0.1:27017/event_management');
    console.log('✅ Database connected');
    
    console.log('🔍 Looking for user: jeet@gmail.com');
    const user = await User.findOne({ email: 'jeet@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User jeet@gmail.com not found in database');
      
      console.log('📋 Available users:');
      const allUsers = await User.find({});
      if (allUsers.length === 0) {
        console.log('❌ No users found in database');
      } else {
        allUsers.forEach(u => {
          console.log(`  - ${u.email} (${u.role})`);
        });
      }
    } else {
      console.log('✅ User found:');
      console.log('  Name:', user.name);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  Password exists:', !!user.password);
      console.log('  Created:', user.createdAt);
    }
    
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Full error:', error);
  }
};

debugJeetUser();
