// frontend/src/pages/customer/UserDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box, Tabs, Tab, Typography,
  Container, CircularProgress, Alert,
  Card, CardContent, TextField, Button,
  List, ListItem, ListItemText, ListItemIcon, Chip,
  Avatar, Grid, Paper, Fab,
  useTheme, alpha, IconButton, Fade, Slide, Zoom, Grow
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  BarChart as AnalyticsIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  ZoomIn as ZoomInIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
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
import NotificationSystem from '../../components/notifications/NotificationSystem';
import ClientFeedbackAnalytics from '../../components/feedback/ClientFeedbackAnalytics';

const UserDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'user',
    department: 'Customer'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalPayments: 0
  });
  const navigate = useNavigate();
  const { logout, user, updateUserProfile } = useAuth();
  const dashboardRef = useRef();

  // Check if current user is admin - moved to component level
  const isAdmin = user && user.role === 'admin';
  console.log('UserDashboard - User:', user?.name, 'Role:', user?.role, 'IsAdmin:', isAdmin);

  // Load user profile data
  useEffect(() => {
    console.log(' User data loaded:', user);
    if (user) {
      console.log(' Setting profile data with role:', user.role);
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
      // Simulate loading stats
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    // Simulate API call to get user statistics
    setStats({
      totalBookings: Math.floor(Math.random() * 20) + 5,
      upcomingEvents: Math.floor(Math.random() * 5) + 1,
      completedEvents: Math.floor(Math.random() * 15) + 3,
      totalPayments: Math.floor(Math.random() * 5000) + 1000
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUserStats();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard refreshed!');
    }, 1000);
  };

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
    <Box 
      ref={dashboardRef}
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.background.default, 0.95)})`,
        position: 'relative'
      }}>
      {/* Enhanced Header with Animated Elements */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Box sx={{ 
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          boxShadow: theme.shadows[8],
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <motion.div
              animate={{
                x: [0, 100, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                background: `linear-gradient(45deg, transparent 30%, ${alpha(theme.palette.primary.main, 0.2)} 70%, transparent)`,
                width: '200%',
                height: '4px'
              }}
            />
          </Box>
          
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <DashboardIcon sx={{ 
                    fontSize: 40, 
                    color: 'white',
                    filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                  }} />
                </motion.div>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {user?.name || 'User'} - {user?.role || 'user'}{user?.services?.includes('photographers') && ' - photographers'}
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ display: 'flex', gap: 12, alignItems: 'center' }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Fab 
                    size="medium"
                    color="secondary"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    sx={{ 
                      background: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <motion.div
                      animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
                    >
                      <RefreshIcon />
                    </motion.div>
                  </Fab>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Fab 
                    size="medium"
                    color="secondary"
                    onClick={handleDownloadPDF}
                    sx={{ 
                      background: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <PdfIcon />
                  </Fab>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Fab 
                    variant="extended"
                    color="error"
                    onClick={handleLogout}
                    sx={{ 
                      background: 'white',
                      color: theme.palette.error.main,
                      ml: 1,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    Logout
                  </Fab>
                </motion.div>
              </motion.div>
            </Box>
          </Container>
        </Box>
      </motion.div>

      {/* Enhanced Vertical Sidebar Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Box sx={{ 
          mt: 3,
          display: 'flex',
          gap: 2,
          height: 'calc(100vh - 280px)' // Increased height to accommodate all navigation items
        }}>
        {/* Vertical Sidebar */}
        <Paper sx={{ 
          width: 280,
          height: '100%',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderRadius: 2,
          boxShadow: theme.shadows[4],
          overflow: 'hidden'
        }}>
          <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
                Navigation
              </Typography>
              <List component="nav" sx={{ p: 0 }}>
                {[
                  { icon: <PersonIcon />, text: 'Profile', tab: 0 },
                  { icon: <EventIcon />, text: 'Services', tab: 1 },
                  { icon: <ScheduleIcon />, text: 'Bookings', tab: 2 },
                  { icon: <AssessmentIcon />, text: 'Preferences', tab: 3 },
                  { icon: <DashboardIcon />, text: 'Payments', tab: 4 },
                  { icon: <EventIcon />, text: 'Availability', tab: 5 },
                  { icon: <CalendarIcon />, text: 'Schedule View', tab: 6, highlight: true },
                  { icon: <NotificationsIcon />, text: 'Notifications', tab: 7 },
                  { icon: <AnalyticsIcon />, text: 'Analytics', tab: 8 }
                ].map((item, index) => (
                  <motion.div
                    key={item.tab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <ListItem
                      button
                      selected={activeTab === item.tab}
                      onClick={() => setActiveTab(item.tab)}
                      component={motion.div}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      sx={{
                        borderRadius: 1,
                        mb: item.highlight ? 2 : 1.5,
                        py: item.highlight ? 1.5 : 1,
                        ...(item.highlight && {
                          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.info.main, 0.05)})`,
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.2)}, ${alpha(theme.palette.info.main, 0.1)})`,
                          }
                        }),
                        '&.Mui-selected': {
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.secondary.main, 0.15)})`,
                          }
                        },
                        '&:hover': {
                          background: alpha(theme.palette.action.hover, 0.1),
                          transform: 'translateX(4px)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: activeTab === item.tab ? 'primary.main' : (item.highlight ? 'secondary.main' : 'text.secondary'),
                        minWidth: 40
                      }}>
                        <motion.div
                          animate={activeTab === item.tab ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0]
                          } : item.highlight ? {
                            scale: [1, 1.1, 1],
                          } : {}}
                          transition={{
                            duration: 0.5,
                            repeat: (activeTab === item.tab || item.highlight) ? Infinity : 0,
                            repeatDelay: 2
                          }}
                        >
                          {item.highlight ? (
                            <Box sx={{ 
                              position: 'relative',
                              color: 'secondary.main'
                            }}>
                              {item.icon}
                              <motion.div
                                style={{
                                  position: 'absolute',
                                  top: -2,
                                  right: -2,
                                  width: 8,
                                  height: 8,
                                  background: theme.palette.secondary.main,
                                  borderRadius: '50%'
                                }}
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [1, 0.7, 1]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity
                                }}
                              />
                            </Box>
                          ) : (
                            item.icon
                          )}
                        </motion.div>
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        sx={{ 
                          '& .MuiListItemText-primary': {
                            fontWeight: (activeTab === item.tab || item.highlight) ? 'bold' : 'normal',
                            color: activeTab === item.tab ? 'primary.main' : (item.highlight ? 'secondary.main' : 'text.primary'),
                            fontSize: item.highlight ? '0.95rem' : '0.875rem'
                          }
                        }}
                      />
                      {activeTab === item.tab && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowForwardIcon sx={{ color: 'primary.main', fontSize: 16 }} />
                        </motion.div>
                      )}
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          </Box>
        </Paper>

        {/* Main Content Area */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ flex: 1 }}
        >
          <Box sx={{ 
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            boxShadow: theme.shadows[4],
            overflow: 'auto',
            p: 2
          }}>
            <AnimatePresence mode="wait">
              {/* User Profile Tab */}
              {activeTab === 0 && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card sx={{ 
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            User Profile
                          </Typography>
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <IconButton
                              onClick={() => {
                                console.log(' Edit button clicked, current isEditing:', isEditing);
                                setIsEditing(!isEditing);
                              }}
                              sx={{ 
                                background: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                  background: alpha(theme.palette.primary.main, 0.2)
                                }
                              }}
                            >
                              <motion.div
                                animate={isEditing ? { rotate: 180 } : { rotate: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {isEditing ? <ZoomInIcon /> : <EditIcon />}
                              </motion.div>
                            </IconButton>
                          </motion.div>
                        </Box>
                      </motion.div>
                    </CardContent>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Box component="form" onSubmit={handleSaveProfile} sx={{ mt: 2, px: 3, pb: 3 }}>
                        <Grid container spacing={3}>
                          {[
                            { label: 'Full Name', name: 'name', type: 'text', required: true },
                            { label: 'Email', name: 'email', type: 'email', required: true },
                            { label: 'Phone', name: 'phone', type: 'tel', required: false },
                            { label: 'Role', name: 'role', type: 'text', required: false },
                            { label: 'Department', name: 'department', type: 'text', required: false }
                          ].map((field, index) => (
                            <Grid item xs={12} md={6} key={field.name}>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
                              >
                                <TextField
                                  fullWidth
                                  label={field.label}
                                  name={field.name}
                                  type={field.type}
                                  value={profile[field.name]}
                                  onChange={handleInputChange}
                                  disabled={!isEditing}
                                  required={field.required}
                                  variant={isEditing ? "outlined" : "filled"}
                                  sx={{ 
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                    '& .MuiInputLabel-root': { color: theme.palette.text.secondary },
                                    '& .MuiFilledInput-root': {
                                      background: alpha(theme.palette.grey[100], 0.5)
                                    }
                                  }}
                                />
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>

                        <AnimatePresence>
                          {isEditing && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                    sx={{ 
                                      background: alpha(theme.palette.grey[500], 0.1),
                                      '&:hover': {
                                        background: alpha(theme.palette.grey[500], 0.2)
                                      }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    sx={{ 
                                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                      minWidth: 120,
                                      '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: theme.shadows[4]
                                      }
                                    }}
                                  >
                                    {loading ? (
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      >
                                        <CircularProgress size={20} color="inherit" />
                                      </motion.div>
                                    ) : 'Save Changes'}
                                  </Button>
                                </motion.div>
                              </Box>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>
                    </motion.div>
                  </Card>
                </motion.div>
              )}

              {/* Service Management Tab */}
              {activeTab === 1 && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card sx={{ 
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <ServiceManagement />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* My Bookings Tab */}
              {activeTab === 2 && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card sx={{ 
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <BookingManagement />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Event Preferences Tab */}
              {activeTab === 3 && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <EventPreferences />
                  </motion.div>
                </motion.div>
              )}

              {/* Payments & Invoices Tab */}
              {activeTab === 4 && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <PaymentManagement />
                  </motion.div>
                </motion.div>
              )}

              {/* Availability Calendar Tab */}
              {activeTab === 5 && (
                <motion.div
                  key="availability"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card sx={{ 
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[2],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <AvailabilityCalendar />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Schedule Management Tab */}
              {activeTab === 6 && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card sx={{ 
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[2],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          style={{ 
                            background: '#e3f2fd', 
                            padding: '10px', 
                            borderRadius: '5px', 
                            marginBottom: '10px', 
                            fontSize: '14px', 
                            fontWeight: 'bold' 
                          }}
                        >
                          🗓️ SCHEDULE VIEW TAB ACTIVE - Tab 6
                        </motion.div>
                        <ScheduleView />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 7 && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card sx={{ 
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <NotificationSystem userRole="customer" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Feedback Analytics Tab */}
              {activeTab === 8 && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card sx={{ 
                    background: 'white',
                    borderRadius: 3,
                    boxShadow: theme.shadows[6],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[12]
                    }
                  }}>
                    <CardContent sx={{ p: 0 }}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          style={{ 
                            background: '#f3e5f5', 
                            padding: '10px', 
                            borderRadius: '5px', 
                            marginBottom: '10px', 
                            fontSize: '14px', 
                            fontWeight: 'bold' 
                          }}
                        >
                          📊 ANALYTICS TAB ACTIVE - Tab 8
                        </motion.div>
                        <ClientFeedbackAnalytics />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      </Box>
    </motion.div>
  </Box>
  );
};

export default UserDashboard;
