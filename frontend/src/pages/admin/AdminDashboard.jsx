// frontend/src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box, Tabs, Tab, Typography,
  Container, CircularProgress, Alert,
  Card, CardContent, TextField, Button,
  List, ListItem, ListItemText, Chip,
  Avatar, Grid, Paper
} from '@mui/material';
import { toast } from 'react-toastify';
import BookingManagement from '../../components/booking/BookingManagement';
import EventPreferences from '../../components/event/EventPreferences';
import PaymentManagement from '../../components/payment/PaymentManagement';
import ServiceManagement from '../../components/service/ServiceManagement';
import AvailabilityCalendar from '../../components/scheduling/AvailabilityCalendar';
import ScheduleView from '../../components/scheduling/ScheduleView';
import UserManagement from '../../components/admin/UserManagement';
import EventExecution from '../../components/event/EventExecution';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'admin',
    department: 'Administration'
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Load user profile data
  useEffect(() => {
    console.log('🔧 User data loaded:', user);
    if (user) {
      const profileData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'admin',
        department: user.department || 'Administration'
      };
      console.log('🔧 Setting profile data:', profileData);
      setProfile(profileData);
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    console.log('Admin tab changed to:', newValue);
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('🔧 Input change:', { name, value, isEditing });
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Here you would typically make an API call to update the profile
      // For now, we'll just show a success message
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with logout button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="admin dashboard tabs"
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="👤 Admin Profile" />
        <Tab label="👥 All Users" />
        <Tab label="📋 All Bookings" />
        <Tab label="🎯 Event Preferences" />
        <Tab label="📋 Event Execution" />
        <Tab label="💳 Payments & Invoices" />
        <Tab label="🛠️ Service Management" />
        <Tab label="📅 Staff Availability Calendar" />
        <Tab label="📊 Schedule Management" />
      </Tabs>

      {/* Admin Profile Tab */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Admin Profile</Typography>
              <Button
                variant="contained"
                onClick={() => {
                  console.log('🔧 Edit button clicked, current isEditing:', isEditing);
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>

            <Box component="form" onSubmit={handleSaveProfile} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
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
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* All Users Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <UserManagement />
          </CardContent>
        </Card>
      )}

      {/* All Bookings Tab */}
      {activeTab === 2 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <BookingManagement />
          </CardContent>
        </Card>
      )}

      {/* Event Preferences Tab */}
      {activeTab === 3 && <EventPreferences />}

      {/* Event Execution Tab */}
      {activeTab === 4 && <EventExecution />}

      {/* Payments & Invoices Tab */}
      {activeTab === 5 && <PaymentManagement />}

      {/* Service Management Tab */}
      {activeTab === 6 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <ServiceManagement />
          </CardContent>
        </Card>
      )}

      {/* Staff Availability Calendar Tab */}
      {activeTab === 7 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <AvailabilityCalendar />
          </CardContent>
        </Card>
      )}

      {/* Schedule Management Tab */}
      {activeTab === 8 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <ScheduleView />
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AdminDashboard;