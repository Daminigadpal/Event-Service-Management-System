// Test event preference creation and update
const mongoose = require('mongoose');
const EventPreference = require('./src/models/EventPreference.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    // First login to get token
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
    console.log('✅ Login successful, got token');
    const userId = loginData.data.id;
    
    // Check if user has preferences
    const existingPreference = await EventPreference.findOne({ user: userId });
    console.log('📋 Existing preference:', existingPreference);
    
    if (!existingPreference) {
      console.log('❌ No preference found, creating one...');
      
      // Create a preference first
      const createData = {
        eventType: 'wedding',
        preferredVenue: 'Grand Ballroom',
        budgetRange: '10000-20000',
        guestCount: '150',
        notes: 'Initial preference'
      };
      
      const createResponse = await fetch('http://localhost:5000/api/v1/event-preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createData)
      });
      
      console.log('📡 Create response:', createResponse.status);
      const createResult = await createResponse.json();
      console.log('📄 Create result:', createResult);
      
      if (createResponse.ok) {
        console.log('✅ Preference created successfully!');
        
        // Now try to update it
        const updateData = {
          eventType: 'corporate',
          preferredVenue: 'Conference Hall',
          budgetRange: '5000-10000',
          guestCount: '100',
          notes: 'Updated preference'
        };
        
        console.log('📡 Updating preference with data:', updateData);
        
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
          console.log('✅ Preference updated successfully!');
        } else {
          console.log('❌ Preference update failed:', updateResult.error);
        }
      } else {
        console.log('❌ Preference creation failed:', createResult.error);
      }
    } else {
      console.log('✅ Preference already exists, updating it...');
      
      // Update existing preference
      const updateData = {
        eventType: 'corporate',
        preferredVenue: 'Conference Hall',
        budgetRange: '5000-10000',
        guestCount: '100',
        notes: 'Updated existing preference'
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
        console.log('✅ Preference updated successfully!');
      } else {
        console.log('❌ Preference update failed:', updateResult.error);
      }
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
