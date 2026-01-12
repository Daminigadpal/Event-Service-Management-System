// Simple server without MongoDB for testing
const express = require('express');
const cors = require('cors');

const app = express();

// CORS with all necessary ports
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie', 'Authorization']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Mock auth endpoint
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  
  // Mock users
  const users = {
    'sejal@gmail.com': { id: '1', name: 'sejal', role: 'admin', email: 'sejal@gmail.com' },
    'staff@gmail.com': { id: '2', name: 'Staff Member', role: 'staff', email: 'staff@gmail.com' },
    'jeet@gmail.com': { id: '3', name: 'Jeet', role: 'user', email: 'jeet@gmail.com' }
  };
  
  const user = users[email];
  if (user && password) {
    res.json({
      success: true,
      token: 'mock-jwt-token',
      data: { user }
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
});

// Mock users endpoint
app.get('/api/v1/public-users', (req, res) => {
  res.json({
    success: true,
    data: [
      { _id: '1', name: 'Jeet', email: 'jeet@gmail.com', role: 'user', department: 'General' },
      { _id: '2', name: 'Anuj', email: 'om@gamil.com', role: 'staff', department: 'Operations' },
      { _id: '3', name: 'ram', email: 'ram@gmail.com', role: 'user', department: 'General' },
      { _id: '4', name: 'Test User', email: 'test@example.com', role: 'user', department: 'General' },
      { _id: '5', name: 'Staff Member', email: 'staff@gmail.com', role: 'staff', department: 'Operations' },
      { _id: '6', name: 'sejal', email: 'sejal@gmail.com', role: 'admin', department: 'Administration' }
    ],
    count: 6
  });
});

// Mock bookings endpoint
app.get('/api/v1/public-bookings', (req, res) => {
  res.json({
    success: true,
    data: [
      { _id: '1', eventType: 'wedding', eventDate: '2026-01-15', eventLocation: 'Grand Hall', guestCount: 150, status: 'confirmed' },
      { _id: '2', eventType: 'birthday', eventDate: '2026-01-20', eventLocation: 'Garden Party', guestCount: 50, status: 'inquiry' },
      { _id: '3', eventType: 'corporate', eventDate: '2026-01-25', eventLocation: 'Conference Room', guestCount: 100, status: 'quoted' }
    ],
    count: 3
  });
});

// Health check
app.get('/', (req, res) => {
  res.send('API is running (mock mode)');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Mock API Server running on port ${PORT}`);
  console.log(`🌐 Available at http://localhost:${PORT}`);
  console.log('📝 Using mock data (MongoDB not required)');
});
