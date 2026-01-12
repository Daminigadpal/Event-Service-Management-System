// Check and fix event preferences
const mongoose = require('mongoose');
const EventPreference = require('./src/models/EventPreference.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Get all event preferences
    const preferences = await EventPreference.find({});
    console.log('📋 Event preferences in DB:', preferences.length);
    
    preferences.forEach((pref, index) => {
      console.log(`${index + 1}. User: ${pref.user}, Event: ${pref.eventType}, Venue: ${pref.preferredVenue}`);
      console.log(`   Budget: ${JSON.stringify(pref.budgetRange)}, Guests: ${pref.guestCount}`);
      console.log(`   ID: ${pref._id}`);
      console.log('');
    });

    // Test update with correct format
    if (preferences.length > 0) {
      const pref = preferences[0];
      console.log('🔧 Testing update with correct format...');
      
      // Login first
      const loginResponse = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'sejal@gmail.com',
          password: 'admin123'
        })
      });
      
      const loginData = await loginResponse.json();
      const token = loginData.token;
      
      // Update with correct format
      const updateData = {
        eventType: 'corporate',
        preferredVenue: 'Conference Hall',
        budgetRange: { min: 5000, max: 10000 }, // Object format
        guestCount: 100,
        notes: 'Updated with correct format'
      };
      
      const updateResponse = await fetch('http://localhost:5000/api/v1/event-preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      console.log('📡 Update response:', updateResponse.status);
      const updateResult = await updateResponse.json();
      console.log('📄 Update result:', updateResult);
      
      if (updateResponse.ok) {
        console.log('✅ Update successful with object format!');
      } else {
        console.log('❌ Update failed:', updateResult.error);
      }
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
