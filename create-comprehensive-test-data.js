const axios = require('axios');

async function createComprehensiveTestData() {
  try {
    console.log('Creating comprehensive test data...');
    
    // Login as admin to get token
    const loginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'sejal@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin token received');
    
    const authHeaders = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 1. Create services
    console.log('\n=== Creating Services ===');
    const services = [
      {
        name: 'Wedding Photography',
        description: 'Professional wedding photography services',
        price: 5000,
        duration: '8 hours',
        category: 'photography'
      },
      {
        name: 'Event Catering',
        description: 'Full catering service for events',
        price: 10000,
        duration: '6 hours',
        category: 'catering'
      },
      {
        name: 'Venue Decoration',
        description: 'Complete venue decoration service',
        price: 7500,
        duration: '4 hours',
        category: 'decoration'
      }
    ];

    const createdServices = [];
    for (const serviceData of services) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/services', serviceData, {
          headers: authHeaders
        });
        createdServices.push(response.data.data);
        console.log(`✅ Created service: ${serviceData.name}`);
      } catch (error) {
        console.log(`⚠️ Service might already exist: ${serviceData.name}`);
      }
    }

    // 2. Create bookings for different users
    console.log('\n=== Creating Bookings ===');
    const bookings = [
      {
        service: createdServices[0]?._id || '507f1f77bcf86cd799439011',
        eventType: 'wedding',
        eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
        eventLocation: 'Grand Ballroom, Downtown Hotel',
        guestCount: 150,
        specialRequests: 'Vegetarian options preferred',
        status: 'Confirmed'
      },
      {
        service: createdServices[1]?._id || '507f1f77bcf86cd799439012',
        eventType: 'corporate',
        eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 21 days from now
        eventLocation: 'Conference Center, Business Park',
        guestCount: 75,
        specialRequests: 'AV equipment needed',
        status: 'Pending'
      },
      {
        service: createdServices[2]?._id || '507f1f77bcf86cd799439013',
        eventType: 'birthday',
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        eventLocation: 'Community Hall, Riverside',
        guestCount: 50,
        specialRequests: 'Kids entertainment area',
        status: 'Inquiry'
      }
    ];

    const createdBookings = [];
    for (const bookingData of bookings) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/bookings', bookingData, {
          headers: authHeaders
        });
        createdBookings.push(response.data.data);
        console.log(`✅ Created booking for ${bookingData.eventType}`);
      } catch (error) {
        console.log(`⚠️ Booking creation failed: ${error.response?.data?.error || error.message}`);
      }
    }

    // 3. Create payments
    console.log('\n=== Creating Payments ===');
    const payments = [
      {
        booking: createdBookings[0]?._id || '507f1f77bcf86cd799439021',
        amount: 2500,
        paymentMethod: 'credit_card',
        status: 'completed',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: 'TXN' + Date.now() + '001'
      },
      {
        booking: createdBookings[1]?._id || '507f1f77bcf86cd799439022',
        amount: 5000,
        paymentMethod: 'bank_transfer',
        status: 'pending',
        paymentDate: new Date().toISOString().split('T')[0],
        transactionId: 'TXN' + Date.now() + '002'
      },
      {
        booking: createdBookings[2]?._id || '507f1f77bcf86cd799439023',
        amount: 1000,
        paymentMethod: 'cash',
        status: 'completed',
        paymentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
        transactionId: 'TXN' + Date.now() + '003'
      }
    ];

    for (const paymentData of payments) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/payments', paymentData, {
          headers: authHeaders
        });
        console.log(`✅ Created payment of $${paymentData.amount}`);
      } catch (error) {
        console.log(`⚠️ Payment creation failed: ${error.response?.data?.error || error.message}`);
      }
    }

    // 4. Create staff availability
    console.log('\n=== Creating Staff Availability ===');
    const availability = [
      {
        staff: '507f1f77bcf86cd799439031', // Mock staff ID
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '17:00',
        status: 'available',
        notes: 'Available for photography assignments'
      },
      {
        staff: '507f1f77bcf86cd799439031',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '18:00',
        status: 'available',
        notes: 'Available for full day events'
      },
      {
        staff: '507f1f77bcf86cd799439032', // Another mock staff ID
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '16:00',
        status: 'busy',
        notes: 'Assigned to corporate event'
      }
    ];

    for (const availabilityData of availability) {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/staff-availability', availabilityData, {
          headers: authHeaders
        });
        console.log(`✅ Created availability for ${availabilityData.date}`);
      } catch (error) {
        console.log(`⚠️ Availability creation failed: ${error.response?.data?.error || error.message}`);
      }
    }

    // 5. Create event preferences for regular user
    console.log('\n=== Creating User Event Preferences ===');
    try {
      // Login as regular user (jeet)
      const userLoginResponse = await axios.post('http://localhost:5000/api/v1/auth/login', {
        email: 'jeet@gmail.com',
        password: 'user123'
      });
      
      const userToken = userLoginResponse.data.token;
      const userAuthHeaders = {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      };

      const userPreference = {
        eventType: 'birthday',
        preferredVenue: 'Outdoor Garden',
        budgetRange: { min: 3000, max: 7000 },
        guestCount: 30,
        notes: 'Looking for a memorable birthday celebration'
      };

      await axios.post('http://localhost:5000/api/v1/event-preferences', userPreference, {
        headers: userAuthHeaders
      });
      console.log('✅ Created event preferences for user');
    } catch (error) {
      console.log(`⚠️ User preference creation failed: ${error.response?.data?.error || error.message}`);
    }

    console.log('\n🎉 Test data creation completed!');
    console.log('\n📊 Summary:');
    console.log('- Services: Available for booking');
    console.log('- Bookings: Created with different statuses');
    console.log('- Payments: Various payment statuses');
    console.log('- Staff Availability: Calendar data available');
    console.log('- Event Preferences: User preferences set');
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: sejal@gmail.com / admin123');
    console.log('Staff: staff@gmail.com / staff123');
    console.log('User: jeet@gmail.com / user123');

  } catch (error) {
    console.error('❌ Error creating test data:', error.response?.data || error.message);
  }
}

createComprehensiveTestData();
