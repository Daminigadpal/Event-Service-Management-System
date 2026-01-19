const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/event_management').then(() => {
  console.log('✅ Connected to MongoDB');
  fixPasswords();
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const fixPasswords = async () => {
  try {
    // Default passwords for each user
    const userPasswords = {
      'sejal@gmail.com': 'admin123',
      'staff@gmail.com': 'staff123', 
      'jeet@gmail.com': 'user123',
      'sai@gmail.com': 'user123',
      'om@gamil.com': 'staff123',
      'admin@gmail.com': 'admin123'
    };

    console.log('🔧 Fixing user passwords...');
    
    for (const [email, password] of Object.entries(userPasswords)) {
      const user = await User.findOne({ email });
      
      if (user) {
        console.log(`👤 Processing user: ${email}`);
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Update user with hashed password
        await User.updateOne(
          { email },
          { $set: { password: hashedPassword } }
        );
        
        console.log(`✅ Password updated for ${email}`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    console.log('🎉 All passwords have been fixed!');
    
    // Verify the updates
    console.log('\n📊 Verifying password updates:');
    for (const email of Object.keys(userPasswords)) {
      const user = await User.findOne({ email }).select('+password');
      if (user) {
        console.log(`  ${email}: Password exists: ${!!user.password}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
    process.exit(1);
  }
};
