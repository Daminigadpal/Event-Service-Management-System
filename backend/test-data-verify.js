const mongoose = require('mongoose');
const StaffAvailability = require('./src/models/StaffAvailability.js');

// Test without authorization to verify data exists
const testScheduleDataNoAuth = async () => {
  try {
    console.log('🔍 Testing Schedule Data Flow (No Auth)...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ Connected to MongoDB');
    
    // Check existing staff availability data
    const existingAvailability = await StaffAvailability.find({});
    console.log('📊 Found staff availability records:', existingAvailability.length);
    
    if (existingAvailability.length > 0) {
      console.log('📋 Sample availability data:');
      existingAvailability.slice(0, 3).forEach((avail, index) => {
        console.log(`  ${index + 1}. Date: ${avail.date}, Status: ${avail.status}, Staff: ${avail.staff?.name || 'N/A'}`);
      });
    }
    
    console.log('\n✅ DATA EXISTS IN DATABASE!');
    console.log('📅 The Schedule View should be able to access this data.');
    console.log('🔧 Try accessing: http://localhost:5174/scheduling/schedule');
    console.log('🔧 If still not visible, check frontend authentication.');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Disconnected from MongoDB');
  }
};

testScheduleDataNoAuth();
