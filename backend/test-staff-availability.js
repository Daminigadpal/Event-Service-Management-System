const mongoose = require('mongoose');
const StaffAvailability = require('./src/models/StaffAvailability.js');

async function testStaffAvailability() {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('Connected to database');

    const today = new Date();
    console.log('Today:', today.toISOString());

    // Check current month records
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    console.log('Start of month:', startOfMonth.toISOString());
    console.log('End of month:', endOfMonth.toISOString());

    const currentMonthRecords = await StaffAvailability.find({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    console.log('Current month availability records:', currentMonthRecords.length);

    if (currentMonthRecords.length > 0) {
      console.log('Sample record:', JSON.stringify(currentMonthRecords[0], null, 2));
    }

    // Check all records
    const allRecords = await StaffAvailability.find().sort({ date: -1 }).limit(5);
    console.log('Latest 5 records:');
    allRecords.forEach(record => {
      console.log(`Date: ${record.date.toISOString().split('T')[0]}, Status: ${record.status}, Staff: ${record.staff}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

testStaffAvailability();