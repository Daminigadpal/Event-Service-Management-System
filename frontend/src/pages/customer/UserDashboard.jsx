      import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box, Tabs, Tab, Typography,
  Container, CircularProgress, Alert,
  Card, CardContent, TextField, Button,
  List, ListItem, ListItemText, Chip,
  Avatar, Grid, Paper
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BookingManagement from '../../components/booking/BookingManagement';
import EventPreferences from '../../components/event/EventPreferences';
import PaymentManagement from '../../components/payment/PaymentManagement';
import ServiceManagement from '../../components/service/ServiceManagement';
import UserManagement from '../../components/admin/UserManagement';
import EventExecution from '../../components/event/EventExecution';
import AvailabilityCalendar from '../../components/scheduling/AvailabilityCalendar';
import ScheduleView from '../../components/scheduling/ScheduleView';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    department: 'Customer'
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { logout, user, updateUserProfile } = useAuth();
  const dashboardRef = useRef();

  // Load user profile data
  useEffect(() => {
    console.log(' User data loaded:', user);
    if (user) {
      const profileData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'user',
        department: user.department || 'Customer'
      };
      console.log(' Setting profile data:', profileData);
      setProfile(profileData);
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    console.log('User tab changed to:', newValue);
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(' Input change:', { name, value, isEditing });
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(' Saving profile:', profile);
      await updateUserProfile(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownloadPDF = async () => {
    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('user-dashboard.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div ref={dashboardRef}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header with logout button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">User Dashboard</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={handleDownloadPDF}
              color="primary"
            >
              Download PDF
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="user dashboard tabs"
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="👤 User Profile" />
          <Tab label="📋 My Bookings" />
          <Tab label="🎯 Event Preferences" />
          <Tab label="💳 Payments & Invoices" />
          <Tab label="🛠️ Service Management" />
          <Tab label="📅 Availability Calendar" />
          <Tab label="📆 Schedule Management" />
        </Tabs>

        {/* User Profile Tab */}
        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">User Profile</Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    console.log(' Edit button clicked, current isEditing:', isEditing);
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

        {/* My Bookings Tab */}
        {activeTab === 1 && (
          <Card>
            <CardContent sx={{ p: 0 }}>
              <BookingManagement />
            </CardContent>
          </Card>
        )}

        {/* Event Preferences Tab */}
        {activeTab === 2 && <EventPreferences />}

        {/* Payments & Invoices Tab */}
        {activeTab === 3 && <PaymentManagement />}

        {/* Service Management Tab */}
        {activeTab === 4 && (
          <Card>
            <CardContent sx={{ p: 0 }}>
              <ServiceManagement />
            </CardContent>
          </Card>
        )}

        {/* Availability Calendar Tab */}
        {activeTab === 5 && (
          <Card>
            <CardContent sx={{ p: 0 }}>
              <AvailabilityCalendar />
            </CardContent>
          </Card>
        )}

        {/* Schedule Management Tab */}
        {activeTab === 6 && (
          <Card>
            <CardContent sx={{ p: 0 }}>
              <ScheduleView />
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default UserDashboard;