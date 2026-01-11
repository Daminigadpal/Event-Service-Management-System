// Simple test server to isolate the issue
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Basic CORS
app.use(cors());
app.use(express.json());

// Test route
app.post('/test', (req, res) => {
  console.log('🎯 TEST ROUTE HIT!');
  console.log('Body:', req.body);
  res.json({ success: true, message: 'Test route works!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    port: 5000,
    timestamp: new Date().toISOString()
  });
});

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/event_management');
    console.log('✅ MongoDB Connected');
    
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Test server running on port ${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test route: http://localhost:${PORT}/test`);
    });
  } catch (error) {
    console.error('❌ Startup error:', error);
  }
};

start();
