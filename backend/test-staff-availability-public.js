const mongoose = require('mongoose');
const StaffAvailability = require('./src/models/StaffAvailability.js');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Get all staff availability records
      const allAvailability = await StaffAvailability.find({})
        .populate('staff', 'name email')
        .sort({ date: 1 });

      console.log(`\n📅 Found ${allAvailability.length} staff availability records:`);
      
      allAvailability.forEach((avail, index) => {
        console.log(`\n${index + 1}. Date: ${new Date(avail.date).toLocaleDateString()}`);
        console.log(`   Staff: ${avail.staff?.name || 'Unknown'} (${avail.staff?.email || 'No email'})`);
        console.log(`   Status: ${avail.status}`);
        console.log(`   Time Slots: ${avail.timeSlots?.length || 0}`);
        
        if (avail.timeSlots && avail.timeSlots.length > 0) {
          avail.timeSlots.forEach((slot, i) => {
            console.log(`     ${i + 1}. ${slot.startTime} - ${slot.endTime} (${slot.isAvailable ? 'Available' : 'Not Available'})`);
          });
        }
        
        if (avail.notes) {
          console.log(`   Notes: ${avail.notes}`);
        }
      });

      // Check for today's availability
      const today = new Date().toISOString().split('T')[0];
      const todayAvailability = allAvailability.filter(avail => 
        new Date(avail.date).toISOString().split('T')[0] === today
      );

      console.log(`\n📊 Today's Availability (${today}):`);
      if (todayAvailability.length > 0) {
        todayAvailability.forEach(avail => {
          console.log(`   ${avail.staff?.name}: ${avail.status}`);
        });
      } else {
        console.log('   No availability set for today');
      }

    } catch (error) {
      console.error('Error fetching availability:', error);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
