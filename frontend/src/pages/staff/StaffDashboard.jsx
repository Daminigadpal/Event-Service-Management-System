// frontend/src/pages/staff/StaffDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Tabs, Tab, Typography, 
  Container, CircularProgress, Alert,
  Card, CardContent, TextField, Button,
  List, ListItem, ListItemText, Chip,
  Avatar, Grid, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import BookingManagement from '../../components/booking/BookingManagement';
import AvailabilityCalendar from '../../components/scheduling/AvailabilityCalendar';
import ScheduleView from '../../components/scheduling/ScheduleView';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    skills: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const { user, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'Staff',
        department: user.department || 'Event Management',
        skills: user.skills || ['Photography', 'Event Setup']
      });
      
      // Mock user bookings data
      const mockBookings = [
        {
          id: 1,
          customerName: 'John Smith',
          eventName: 'Wedding Ceremony',
          date: '2024-01-15',
          time: '14:00',
          location: 'Grand Ballroom',
          status: 'confirmed',
          services: ['Photography', 'Decoration'],
          paymentStatus: 'paid'
        },
        {
          id: 2,
          customerName: 'Sarah Johnson',
          eventName: 'Corporate Event',
          date: '2024-01-18',
          time: '10:00',
          location: 'Conference Hall A',
          status: 'pending',
          services: ['Videography', 'Catering'],
          paymentStatus: 'pending'
        },
        {
          id: 3,
          customerName: 'Mike Wilson',
          eventName: 'Birthday Party',
          date: '2024-01-20',
          time: '18:00',
          location: 'Garden Area',
          status: 'completed',
          services: ['Photography', 'Entertainment'],
          paymentStatus: 'paid'
        }
      ];
      
      setUserBookings(mockBookings);
      setLoading(false);
    }
  }, [user]); // Add user as dependency to re-run when user data changes

  const handleTabChange = (event, newValue) => {
    console.log('Tab changed to:', newValue);
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('🔧 Staff Input change:', { name, value, isEditing });
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(profile);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' ? 'success' : 'warning';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with logout button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🎯 Staff Dashboard
        </Typography>
        <Button 
          variant="outlined" 
          color="error"
          onClick={handleLogout}
          startIcon={<span>🚪</span>}
        >
          Logout
        </Button>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        aria-label="staff dashboard tabs"
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="👤 Profile" />
        <Tab label="📅 Availability Calendar" />
        <Tab label="📊 Schedule View" />
        <Tab label="📋 My Bookings" />
      </Tabs>

      {/* Profile Tab */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Staff Profile</Typography>
              <Button 
                variant="contained" 
                onClick={() => {
                  console.log('🔧 Staff Edit button clicked, current isEditing:', isEditing);
                  setIsEditing(!isEditing);
                }}
                startIcon={<span>✏️</span>}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>
            
            <Box component="form" onSubmit={handleSaveProfile} sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    value={profile.role}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profile.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Skills"
                    name="skills"
                    value={profile.skills.join(', ')}
                    onChange={(e) => setProfile(prev => ({...prev, skills: e.target.value.split(',').map(s => s.trim())}))}
                    disabled={!isEditing}
                    helperText="Separate multiple skills with commas"
                    variant={isEditing ? "outlined" : "filled"}
                  />
                </Grid>
              </Grid>
              
              {isEditing && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    startIcon={<span>💾</span>}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Availability Calendar Tab */}
      {activeTab === 1 && (
        <Box>
          <AvailabilityCalendar />
        </Box>
      )}

      {/* Schedule View Tab */}
      {activeTab === 2 && (
        <Box>
          <ScheduleView />
        </Box>
      )}

      {/* My Bookings Tab */}
      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              📋 My Assigned Bookings
            </Typography>
            
            <List>
              {userBookings.map((booking) => (
                <Paper key={booking.id} sx={{ mb: 2, p: 2 }}>
                  <ListItem alignItems="flex-start">
                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 8 }}>
                          <Typography variant="h6" color="primary">
                            {booking.eventName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            👤 Customer: {booking.customerName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            📍 Location: {booking.location}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip 
                              label={booking.status} 
                              color={getStatusColor(booking.status)}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Chip 
                              label={`Payment: ${booking.paymentStatus}`} 
                              color={getPaymentStatusColor(booking.paymentStatus)}
                              size="small"
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              📅 {booking.date}
                            </Typography>
                            <Typography variant="body2">
                              ⏰ {booking.time}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            🛠️ Services: {booking.services.join(', ')}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default StaffDashboard;