const mongoose = require('mongoose');

// Check what users exist in database
const checkUsers = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ Connected to MongoDB');
    
    const User = require('./src/models/User.js');
    const users = await User.find({});
    
    console.log('📊 Users found in database:', users.length);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email}, Name: ${user.name}, Role: ${user.role}, Password exists: ${user.password ? 'Yes' : 'No'}`);
    });
    
    if (users.length === 0) {
      console.log('❌ No users found. Creating default users...');
      
      // Create default users
      const bcrypt = require('bcryptjs');
      const defaultUsers = [
        {
          name: 'sejal',
          email: 'sejal@gmail.com',
          role: 'admin',
          department: 'Administration',
          password: await bcrypt.hash('admin123', 10)
        },
        {
          name: 'Staff Member',
          email: 'staff@gmail.com',
          role: 'staff',
          department: 'Operations',
          password: await bcrypt.hash('staff123', 10)
        },
        {
          name: 'Jeet',
          email: 'jeet@gmail.com',
          role: 'user',
          department: 'General',
          password: await bcrypt.hash('user123', 10)
        }
      ];
      
      await User.insertMany(defaultUsers);
      console.log('✅ Default users created successfully');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
};

checkUsers();
