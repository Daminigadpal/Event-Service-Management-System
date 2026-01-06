require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Import routes
// ... (keep all your existing requires at the top)
const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const userRoutes = require('./src/routes/userRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const deliverableRoutes = require('./src/routes/deliverableRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/deliverables', deliverableRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Event Service Management System API',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getMe: 'GET /api/auth/me (requires auth)'
      },
      events: {
        getEvents: 'GET /api/events',
        getEvent: 'GET /api/events/:id',
        createEvent: 'POST /api/events (requires auth)'
      },
      services: {
        getServices: 'GET /api/services',
        createService: 'POST /api/services (admin)',
        getService: 'GET /api/services/:id',
        updateService: 'PUT /api/services/:id (admin)',
        deleteService: 'DELETE /api/services/:id (admin)'
      }
    }
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Simple route logging
function logRoutes() {
  console.log('\nAvailable Routes:');
  console.log('GET    /');
  console.log('AUTH:');
  console.log('  POST   /api/auth/register');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/auth/me');
  console.log('\nUSERS:');
  console.log('  GET    /api/users/test');
  console.log('  GET    /api/users');
  console.log('  GET    /api/users/:id');
  console.log('  PUT    /api/users/:id');
  console.log('  DELETE /api/users/:id');
  console.log('\nEVENTS:');
  console.log('  GET    /api/events');
  console.log('  GET    /api/events/:id');
  console.log('  POST   /api/events');
  console.log('\nSERVICES:');
  console.log('  GET    /api/services');
  console.log('  POST   /api/services (admin)');
  console.log('  GET    /api/services/:id');
  console.log('  PUT    /api/services/:id (admin)');
  console.log('  DELETE /api/services/:id (admin)\n');
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`\nServer running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
  logRoutes();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});