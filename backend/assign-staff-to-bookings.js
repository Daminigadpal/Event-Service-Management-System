const mongoose = require('mongoose');
const Booking = require('./src/models/Booking.js');
const User = require('./src/models/User.js');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Get staff users
      const staffUsers = await User.find({ role: { $in: ['admin', 'staff'] } });
      console.log(`Found ${staffUsers.length} staff users:`);
      staffUsers.forEach(staff => {
        console.log(`- ${staff.name} (${staff.email}) - ID: ${staff._id}`);
      });

      // Get all bookings
      const allBookings = await Booking.find({});
      
      console.log(`\nFound ${allBookings.length} total bookings`);

      if (allBookings.length > 0 && staffUsers.length > 0) {
        // Assign staff to bookings that don't have staff assigned
        for (let i = 0; i < allBookings.length; i++) {
          const booking = allBookings[i];
          
          // Only assign if staffAssigned is null, undefined, or empty
          if (!booking.staffAssigned || booking.staffAssigned === "") {
            const staff = staffUsers[i % staffUsers.length]; // Rotate through staff
            
            booking.staffAssigned = staff._id;
            await booking.save();
            
            console.log(`✅ Assigned ${staff.name} to booking: ${booking.eventType} on ${new Date(booking.eventDate).toLocaleDateString()}`);
          } else {
            console.log(`⏭️  Skipping booking ${booking.eventType} - already has staff assigned`);
          }
        }
      }

      // Show updated bookings
      const updatedBookings = await Booking.find({})
        .populate('customer', 'name email')
        .populate('staffAssigned', 'name email')
        .sort({ eventDate: 1 });

      console.log(`\n📋 Updated Bookings (${updatedBookings.length} total):`);
      updatedBookings.forEach((booking, index) => {
        console.log(`\n${index + 1}. ${booking.eventType} - ${new Date(booking.eventDate).toLocaleDateString()}`);
        console.log(`   Customer: ${booking.customer?.name || 'Unknown'}`);
        console.log(`   Staff: ${booking.staffAssigned?.name || 'Not assigned'} (${booking.staffAssigned?.email || 'No email'})`);
        console.log(`   Status: ${booking.status}`);
      });

    } catch (error) {
      console.error('Error assigning staff:', error);
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
