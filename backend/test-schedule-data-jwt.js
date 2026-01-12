const mongoose = require('mongoose');
const StaffAvailability = require('./src/models/StaffAvailability.js');
const User = require('./src/models/User.js');
const jwt = require('jsonwebtoken');

// Test script with proper JWT token
const testScheduleData = async () => {
  try {
    console.log('🔍 Testing Schedule Data Flow with Proper JWT...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ Connected to MongoDB');
    
    // Find a real user
    const user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    
    console.log('✅ Found test user:', user.name);
    
    // Create a proper JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
    
    console.log('🔑 Generated JWT token:', token);
    
    // Check existing staff availability data
    const existingAvailability = await StaffAvailability.find({});
    console.log('📊 Found staff availability records:', existingAvailability.length);
    
    if (existingAvailability.length > 0) {
      console.log('📋 Sample availability data:');
      existingAvailability.slice(0, 3).forEach((avail, index) => {
        console.log(`  ${index + 1}. Date: ${avail.date}, Status: ${avail.status}, Staff: ${avail.staff?.name || 'N/A'}`);
      });
    }
    
    // Test the API endpoints with proper JWT token
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    console.log('\n🔍 Testing API endpoints with proper JWT...');
    console.log('Week start:', weekStart.toISOString().split('T')[0]);
    console.log('Week end:', weekEnd.toISOString().split('T')[0]);
    
    // This simulates what the frontend ScheduleView is calling
    const response = await fetch('http://localhost:5000/api/v1/staff-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Use proper JWT token
      },
      body: JSON.stringify({
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:', data);
      
      if (data.success && data.data) {
        console.log('📅 Schedule data that should be visible:');
        data.data.slice(0, 3).forEach((avail, index) => {
          console.log(`  ${index + 1}. Date: ${avail.date}, Status: ${avail.status}`);
        });
      } else {
        console.log('❌ No data in API response');
      }
    } else {
      console.log('❌ API call failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔚 Disconnected from MongoDB');
  }
};

testScheduleData();
