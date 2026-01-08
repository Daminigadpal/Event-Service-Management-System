// frontend/src/pages/customer/UserDashboard.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';

const UserDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>
      <Typography>
        This is your customer dashboard. You can manage your bookings and profile here.
      </Typography>
    </Container>
  );
};

export default UserDashboard;