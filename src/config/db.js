const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    // Local MongoDB connection
    const connectionString = 'mongodb://127.0.0.1:27017/event_management';
    
    const conn = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log('MongoDB Connected to local database');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MongoDB is running (check Windows Services)');
    console.log('2. Try running "mongod" in a new terminal as Administrator');
    console.log('3. Check if port 27017 is not in use');
    process.exit(1);
  }
};

module.exports = connectDB;