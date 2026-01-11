const mongoose = require('mongoose');
const EventPreference = require('./src/models/EventPreference.js');
const User = require('./src/models/User.js');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Find the test user we created
      const user = await User.findOne({ email: 'test@example.com' });
      if (!user) {
        console.log('Test user not found');
        return;
      }

      console.log('Found user:', user.name, 'ID:', user._id);

      // Create a test event preference
      const preference = await EventPreference.create({
        user: user._id,
        eventType: 'wedding',
        preferredVenue: 'Grand Ballroom',
        budgetRange: {
          min: 1000,
          max: 3000
        },
        guestCount: 50,
        notes: 'Test preference from server side'
      });

      console.log('✅ Event preference created successfully:');
      console.log('- ID:', preference._id);
      console.log('- Event Type:', preference.eventType);
      console.log('- Venue:', preference.preferredVenue);
      console.log('- Budget Range:', preference.budgetRange);
      console.log('- Guest Count:', preference.guestCount);
      console.log('- Notes:', preference.notes);

    } catch (error) {
      console.error('❌ Error creating event preference:', error.message);
    }

    mongoose.connection.close();
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error.message);
  });