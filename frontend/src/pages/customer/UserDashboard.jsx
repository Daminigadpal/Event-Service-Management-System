// frontend/src/pages/customer/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Tabs, Tab, Typography, 
  Container, CircularProgress, Alert,
  Card, CardContent, TextField, Button
} from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import BookingManagement from '../../components/booking/BookingManagement';
import EventPreferences from '../../components/event/EventPreferences';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUserProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        aria-label="dashboard tabs"
        sx={{ mb: 3 }}
      >
        <Tab label="Profile" />
        <Tab label="My Bookings" />
        <Tab label="Event Preferences" />
      </Tabs>

      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Profile Information</Typography>
              <Button 
                variant="contained" 
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>
            
            <Box component="form" onSubmit={handleSaveProfile} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                name="address"
                multiline
                rows={3}
                value={profile.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              
              {isEditing && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && <BookingManagement />}
      {activeTab === 2 && <EventPreferences />}
    </Container>
  );
};

export default UserDashboard;