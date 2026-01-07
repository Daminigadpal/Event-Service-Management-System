const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully!');
    
    // List all databases
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    // Close the connectionnode index.js
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
}

testConnection();