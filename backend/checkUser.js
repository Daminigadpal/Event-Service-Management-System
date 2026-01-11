const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/event_management')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection.db.collection('users').findOne({email: 'jeet@gmail.com'});
  })
  .then(user => {
    if (user) {
      console.log('❌ User jeet@gmail.com already exists in database');
    } else {
      console.log('✅ User jeet@gmail.com does not exist in database - ready to register');
    }
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection error:', err);
    process.exit(1);
  });
