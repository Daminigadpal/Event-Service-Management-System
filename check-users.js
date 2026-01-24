const mongoose = require('mongoose');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('🔍 Checking users in database...');
    
    const User = require('./backend/src/models/User.js');
    const users = await User.find({});
    console.log('📊 Total users found:', users.length);
    
    if (users.length > 0) {
      users.forEach(user => {
        console.log('👤 User:', user.email, 'Role:', user.role);
      });
    } else {
      console.log('❌ No users found - need to create users');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database error:', err);
    process.exit(1);
  }
}

checkUsers();
