import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box, Tabs, Tab, Typography,
  Container, CircularProgress, Alert,
  Card, CardContent, TextField, Button,
  List, ListItem, ListItemText, Chip,
  Avatar, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Divider,
  Drawer, ListItemIcon, ListItemButton,
  useTheme, alpha, IconButton,
  AppBar, Toolbar, useMediaQuery, LinearProgress,
  Fab, Tooltip, Fade, Slide, Zoom
} from '@mui/material';
import { 
  PictureAsPdf as PdfIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Payment as PaymentIcon,
  Settings as SettingsIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  ArrowForward as ArrowForwardIcon,
  LocationOn as LocationOnIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import BookingManagement from '../../components/booking/BookingManagement';
import EventPreferencesWorking from '../../components/event/EventPreferences';
import PaymentManagement from '../../components/payment/PaymentManagement';
import ServiceManagement from '../../components/service/ServiceManagement';
import AvailabilityCalendar from '../../components/scheduling/AvailabilityCalendar';
import ScheduleView from '../../components/scheduling/ScheduleView';
import UserManagement from '../../components/admin/UserManagement';
import EventExecution from '../../components/event/EventExecution';
import NotificationSystem from '../../components/notifications/NotificationSystem';
import {
  getBookings,
  getAllBookings
} from '../../services/bookingService.js';
import {
  getEventPreferences,
  getAllEventPreferences
} from '../../services/eventPreferenceService.js';
import {
  getPayments
} from '../../services/paymentService.js';
import {
  getAllUsers
} from '../../services/userService.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
  const { logout, user, updateUserProfile } = useAuth();
  const dashboardRef = useRef();

  // Overview data state
  const [overviewData, setOverviewData] = useState({
    users: [],
    bookings: [],
    eventPreferences: [],
    payments: [],
    services: [],
    stats: {
      totalUsers: 0,
      totalBookings: 0,
      totalPayments: 0,
      totalRevenue: 0,
      totalEventPreferences: 0,
      totalServices: 0
    }
  });

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
      console.log(' Setting profile data:', profileData);
      setProfile(profileData);
    }
  }, [user]);

  // Fetch all overview data
  useEffect(() => {
    if (activeTab === 0) {
      fetchOverviewData();
    }
  }, [activeTab]);

  const fetchOverviewData = async () => {
    try {
      setOverviewLoading(true);
      console.log(' DASHBOARD: Fetching all data for overview...');

      // Fetch all data in parallel
      const [
        usersResponse,
        bookingsResponse,
        eventPreferencesResponse,
        paymentsResponse
      ] = await Promise.all([
        getAllUsers().catch(err => ({ success: false, data: [] })),
        getAllBookings().catch(err => ({ success: false, data: [] })),
        getAllEventPreferences().catch(err => ({ success: false, data: [] })),
        getPayments().catch(err => ({ success: false, data: [] }))
      ]);

      console.log(' DASHBOARD: Users response:', usersResponse);
      console.log(' DASHBOARD: Bookings response:', bookingsResponse);
      console.log(' DASHBOARD: Event preferences response:', eventPreferencesResponse);
      console.log(' DASHBOARD: Payments response:', paymentsResponse);

      const users = usersResponse.success && usersResponse.data ? usersResponse.data : [];
      const bookings = bookingsResponse.success && bookingsResponse.data ? bookingsResponse.data : [];
      const eventPreferences = eventPreferencesResponse.success && eventPreferencesResponse.data ? eventPreferencesResponse.data : [];
      const payments = paymentsResponse.success && paymentsResponse.data ? paymentsResponse.data : [];

      // Calculate total revenue from payments
      const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

      // Enhanced payments with booking details
      const enhancedPayments = payments.map(payment => ({
        ...payment,
        booking: bookings.find(booking => booking._id === payment.booking) || null
      }));

      // Enhanced bookings with payment status
      const enhancedBookings = bookings.map(booking => {
        const relatedPayment = payments.find(payment => payment.booking === booking._id);
        return {
          ...booking,
          paymentStatus: relatedPayment ? 'paid' : 'pending',
          paymentAmount: relatedPayment ? relatedPayment.amount : 0
        };
      });

      console.log('📊 DASHBOARD: Enhanced payments:', enhancedPayments);
      console.log('📊 DASHBOARD: Enhanced bookings:', enhancedBookings);

      const overview = {
        users,
        bookings: enhancedBookings,
        eventPreferences,
        payments: enhancedPayments,
        services: [], // Add services later if needed
        stats: {
          totalUsers: users.length,
          totalBookings: bookings.length,
          totalPayments: payments.length,
          totalRevenue: totalRevenue,
          totalEventPreferences: eventPreferences.length,
          totalServices: 0
        }
      };

      console.log(' DASHBOARD: Overview data:', overview);
      setOverviewData(overview);
    } catch (error) {
      console.error(' DASHBOARD: Error fetching overview data:', error);
    } finally {
      setOverviewLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOverviewData();
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Dashboard refreshed successfully!');
    }, 1000);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    console.log('Admin tab changed to:', newValue);
    setActiveTab(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(' Input change:', { name, value, isEditing });
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

      pdf.save('admin-dashboard.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div ref={dashboardRef}>
      {/* Enhanced Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AppBar 
          position="sticky" 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: theme.shadows[8],
            mb: 2,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0 
          }}>
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
          
          <Toolbar>
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                  component={motion.div}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            )}
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
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
                <Avatar 
                  sx={{ 
                    bgcolor: 'white', 
                    color: theme.palette.primary.main,
                    mr: 2,
                    width: 40,
                    height: 40,
                    boxShadow: theme.shadows[2]
                  }}
                >
                  <DashboardIcon />
                </Avatar>
              </motion.div>
              <Typography variant="h6" component="div" sx={{ 
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
              }}>
                Admin Dashboard
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Fab 
                  size="small"
                  color="secondary"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  sx={{ 
                    background: 'white',
                    color: theme.palette.primary.main,
                    mr: 1,
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<PdfIcon />}
                  onClick={handleDownloadPDF}
                  sx={{ 
                    background: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      background: alpha(theme.palette.background.paper, 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  Download PDF
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      background: alpha(theme.palette.background.paper, 0.1),
                      borderColor: 'white'
                    }
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            </motion.div>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Enhanced Animated Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: 280,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: 280,
              background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.background.default, 0.98)})`,
              borderRight: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Animated Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box sx={{ 
                textAlign: 'center',
                mb: 3,
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [theme.shadows[2], theme.shadows[4], theme.shadows[2]]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '1.5rem',
                      margin: '0 auto 1rem',
                      boxShadow: theme.shadows[3]
                    }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </Avatar>
                </motion.div>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {profile.role}
                </Typography>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip 
                    icon={<DashboardIcon />}
                    label="Administrator" 
                    color="primary" 
                    size="small"
                    sx={{
                      '&:hover': {
                        background: theme.palette.primary.dark
                      }
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>

            {/* Animated Navigation Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>
                Navigation
              </Typography>
              <List sx={{ mb: 3 }}>
                {[
                  { icon: <DashboardIcon />, text: 'Complete Overview', tab: 0, highlight: true },
                  { icon: <PersonIcon />, text: 'Admin Profile', tab: 1 },
                  { icon: <GroupIcon />, text: 'All Users', tab: 2 },
                  { icon: <AssignmentIcon />, text: 'All Bookings', tab: 3 },
                  { icon: <EventIcon />, text: 'Event Preferences', tab: 4 },
                  { icon: <EventIcon />, text: 'Event Execution', tab: 5 },
                  { icon: <PaymentIcon />, text: 'Payments & Invoices', tab: 6 },
                  { icon: <SettingsIcon />, text: 'Service Management', tab: 7 },
                  { icon: <CalendarIcon />, text: 'Staff Availability', tab: 8 },
                  { icon: <ScheduleIcon />, text: 'Schedule Management', tab: 9 },
                  { icon: <NotificationsIcon />, text: 'Notifications', tab: 10 },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <ListItem
                      disablePadding
                      sx={{ mb: 1 }}
                    >
                      <ListItemButton
                        onClick={() => setActiveTab(item.tab)}
                        component={motion.div}
                        whileHover={{ scale: 1.02, x: 8 }}
                        whileTap={{ scale: 0.98 }}
                        sx={{
                          borderRadius: 2,
                          background: activeTab === item.tab ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.1)})` : 'transparent',
                          border: activeTab === item.tab ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}` : '1px solid transparent',
                          ...(item.highlight && {
                            background: activeTab === item.tab ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.1)})` : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.info.main, 0.02)})`,
                            border: activeTab === item.tab ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}` : `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
                          }),
                          '&:hover': {
                            background: item.highlight 
                              ? `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.info.main, 0.05)})`
                              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                            transform: 'translateX(4px)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ 
                          color: activeTab === item.tab ? theme.palette.primary.main : (item.highlight ? theme.palette.secondary.main : 'inherit'),
                          minWidth: 40
                        }}>
                          <motion.div
                            animate={activeTab === item.tab ? {
                              scale: [1, 1.2, 1],
                              rotate: [0, 5, -5, 0]
                            } : item.highlight ? {
                              scale: [1, 1.1, 1]
                            } : {}}
                            transition={{
                              duration: 0.5,
                              repeat: (activeTab === item.tab || item.highlight) ? Infinity : 0,
                              repeatDelay: 2
                            }}
                          >
                            {item.icon}
                          </motion.div>
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontWeight: activeTab === item.tab ? 'bold' : 'normal',
                              color: activeTab === item.tab ? theme.palette.primary.main : (item.highlight ? theme.palette.secondary.main : 'inherit')
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
                      </ListItemButton>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          </Box>
        </Drawer>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 240,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.background.default, 0.95)})`
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Navigation
          </Typography>
          <List>
            {[
              { icon: <DashboardIcon />, text: 'Complete Overview', tab: 0 },
              { icon: <PersonIcon />, text: 'Admin Profile', tab: 1 },
              { icon: <GroupIcon />, text: 'All Users', tab: 2 },
              { icon: <AssignmentIcon />, text: 'All Bookings', tab: 3 },
              { icon: <EventIcon />, text: 'Event Preferences', tab: 4 },
              { icon: <EventIcon />, text: 'Event Execution', tab: 5 },
              { icon: <PaymentIcon />, text: 'Payments & Invoices', tab: 6 },
              { icon: <SettingsIcon />, text: 'Service Management', tab: 7 },
              { icon: <CalendarIcon />, text: 'Staff Availability', tab: 8 },
              { icon: <ScheduleIcon />, text: 'Schedule Management', tab: 9 },
              { icon: <NotificationsIcon />, text: 'Notifications', tab: 10 },
            ].map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => { setActiveTab(item.tab); handleDrawerToggle(); }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Enhanced Main Content Area */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            width: { md: `calc(100% - 280px)` },
            ml: { md: '280px' },
            minHeight: '100vh',
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}>

            <AnimatePresence mode="wait">
              {/* Complete Overview Tab */}
              {activeTab === 0 && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box>
                    {overviewLoading ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                          <CircularProgress size={60} thickness={4} />
                          <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading all data...</Typography>
                        </Box>
                      </motion.div>
                    ) : (
                      <Box>
                        <Grid container spacing={3}>
                          {/* Animated Statistics Cards */}
                          {[
                          { 
                            title: 'Total Users', 
                            value: overviewData.stats.totalUsers, 
                            icon: <GroupIcon />,
                            color: 'primary',
                            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            emoji: '👥'
                          },
                          { 
                            title: 'Total Bookings', 
                            value: overviewData.stats.totalBookings, 
                            icon: <AssignmentIcon />,
                            color: 'secondary',
                            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            emoji: '📋'
                          },
                          { 
                            title: 'Total Payments', 
                            value: overviewData.stats.totalPayments, 
                            icon: <PaymentIcon />,
                            color: 'info',
                            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            emoji: '💳'
                          },
                          { 
                            title: 'Total Revenue', 
                            value: `$${overviewData.stats.totalRevenue.toLocaleString()}`, 
                            icon: <TrendingUpIcon />,
                            color: 'success',
                            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                            emoji: '💰'
                          }
                        ].map((stat, index) => (
                          <Grid item xs={12} md={3} key={stat.title}>
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Card sx={{ 
                                background: stat.gradient,
                                color: 'white',
                                borderRadius: 3,
                                boxShadow: theme.shadows[8],
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                  boxShadow: theme.shadows[12],
                                  transform: 'translateY(-8px)'
                                },
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  background: `linear-gradient(45deg, transparent 30%, ${alpha('#ffffff', 0.1)} 70%, transparent)`,
                                  transform: 'translateX(-100%)',
                                  transition: 'transform 0.6s ease'
                                },
                                '&:hover::before': {
                                  transform: 'translateX(100%)'
                                }
                              }}>
                                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                  <motion.div
                                    animate={{
                                      y: [0, -5, 0]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      delay: index * 0.2
                                    }}
                                  >
                                    <Box sx={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      mb: 2,
                                      fontSize: '2rem'
                                    }}>
                                      {stat.emoji}
                                    </Box>
                                  </motion.div>
                                  <Typography variant="h4" component="div" sx={{ 
                                    fontWeight: 'bold',
                                    mb: 1
                                  }}>
                                    {stat.value}
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    opacity: 0.9,
                                    fontWeight: 'medium'
                                  }}>
                                    {stat.title}
                                  </Typography>
                                  <Box sx={{ mt: 2 }}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={100} 
                                      sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: alpha('#ffffff', 0.3),
                                        '& .MuiLinearProgress-bar': {
                                          borderRadius: 3,
                                          backgroundColor: 'rgba(255, 255, 255, 0.8)'
                                        }
                                      }}
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}

                        {/* Recent Users with Animation */}
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <Card sx={{
                              borderRadius: 3,
                              boxShadow: theme.shadows[4],
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[8]
                              }
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <motion.div
                                    animate={{
                                      rotate: [0, 10, -10, 0]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 3
                                    }}
                                  >
                                    <GroupIcon sx={{ 
                                      fontSize: 24, 
                                      mr: 1, 
                                      color: theme.palette.primary.main 
                                    }} />
                                  </motion.div>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                    👥 Recent Users
                                  </Typography>
                                </Box>
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {overviewData.users.slice(0, 5).map((user, index) => (
                                        <motion.tr
                                          key={user._id}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                                        >
                                          <TableCell>{user.name}</TableCell>
                                          <TableCell>{user.email}</TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <Chip 
                                                label={user.role} 
                                                size="small" 
                                                color={user.role === 'admin' ? 'primary' : 'default'}
                                                sx={{
                                                  '&:hover': {
                                                    transform: 'scale(1.05)'
                                                  }
                                                }}
                                              />
                                            </motion.div>
                                          </TableCell>
                                        </motion.tr>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>

                        {/* Recent Bookings with Enhanced Animation */}
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                          >
                            <Card sx={{
                              borderRadius: 3,
                              boxShadow: theme.shadows[4],
                              transition: 'all 0.3s ease',
                              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.default, 0.95)})`,
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[8]
                              }
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <motion.div
                                    animate={{
                                      rotate: [0, -10, 10, 0]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 3
                                    }}
                                  >
                                    <AssignmentIcon sx={{ 
                                      fontSize: 24, 
                                      mr: 1, 
                                      color: theme.palette.secondary.main 
                                    }} />
                                  </motion.div>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>
                                    📋 Recent Bookings
                                  </Typography>
                                </Box>
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>Event Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.secondary.main }}>Status</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {overviewData.bookings.slice(0, 5).map((booking, index) => (
                                        <motion.tr
                                          key={booking._id}
                                          initial={{ opacity: 0, x: 20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                                        >
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                background: alpha(theme.palette.secondary.main, 0.05)
                                              }}>
                                                <EventIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.secondary.main }} />
                                                {booking.eventType}
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                background: alpha(theme.palette.info.main, 0.05)
                                              }}>
                                                <CalendarIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.info.main }} />
                                                {new Date(booking.eventDate).toLocaleDateString()}
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <Chip 
                                                label={booking.status} 
                                                size="small" 
                                                color={booking.status === 'confirmed' ? 'success' : 'warning'}
                                                sx={{
                                                  fontWeight: 'bold',
                                                  '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: theme.shadows[2]
                                                  }
                                                }}
                                              />
                                            </motion.div>
                                          </TableCell>
                                        </motion.tr>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>

                        {/* Enhanced Payments & Bookings Section */}
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                          >
                            <Card sx={{
                              borderRadius: 3,
                              boxShadow: theme.shadows[4],
                              transition: 'all 0.3s ease',
                              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.02)}, ${alpha(theme.palette.background.paper, 0.98)})`,
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[8]
                              }
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 2
                                    }}
                                  >
                                    <PaymentIcon sx={{ 
                                      fontSize: 24, 
                                      mr: 1, 
                                      color: theme.palette.success.main 
                                    }} />
                                  </motion.div>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                                    💳 Recent Payments & Bookings
                                  </Typography>
                                </Box>
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>User</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>Event</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>Method</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {overviewData.payments.slice(0, 5).map((payment, index) => (
                                        <motion.tr
                                          key={payment._id}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                                        >
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                  {payment.user?.name || 'Unknown User'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                  {payment.user?.email || 'No email'}
                                                </Typography>
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <Box sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 2,
                                                background: alpha(theme.palette.success.main, 0.1),
                                                border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                                              }}>
                                                <TrendingUpIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.success.main }} />
                                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                                  ${payment.amount}
                                                </Typography>
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              <Box>
                                                <Typography variant="body2">
                                                  {payment.booking?.eventType || 'General Event'}
                                                </Typography>
                                                {payment.booking?.eventDate && (
                                                  <Typography variant="caption" color="text.secondary">
                                                    {new Date(payment.booking.eventDate).toLocaleDateString()}
                                                  </Typography>
                                                )}
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                            >
                                              <Chip 
                                                label={payment.paymentMethod} 
                                                size="small" 
                                                variant="outlined"
                                                color={payment.paymentMethod === 'cash' ? 'success' : 'primary'}
                                                sx={{
                                                  fontWeight: 'bold',
                                                  '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: theme.shadows[2]
                                                  }
                                                }}
                                              />
                                            </motion.div>
                                          </TableCell>
                                        </motion.tr>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>

                        {/* Enhanced Event Preferences Section */}
                        <Grid item xs={12} md={6}>
                          <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                          >
                            <Card sx={{
                              borderRadius: 3,
                              boxShadow: theme.shadows[4],
                              transition: 'all 0.3s ease',
                              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.02)}, ${alpha(theme.palette.background.paper, 0.98)})`,
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[8]
                              }
                            }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <motion.div
                                    animate={{
                                      rotate: [0, 15, -15, 0]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      repeatDelay: 3
                                    }}
                                  >
                                    <EventIcon sx={{
                                      fontSize: 24,
                                      mr: 1,
                                      color: theme.palette.info.main
                                    }} />
                                  </motion.div>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                                    🎯 Event Preferences
                                  </Typography>
                                </Box>
                                <TableContainer>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>User</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>Event Type</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>Venue</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {overviewData.eventPreferences.slice(0, 5).map((pref, index) => (
                                        <motion.tr
                                          key={pref._id}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                                        >
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                background: alpha(theme.palette.info.main, 0.05)
                                              }}>
                                                <PersonIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.info.main }} />
                                                {pref.user?.name || 'Unknown'}
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                background: alpha(theme.palette.secondary.main, 0.05)
                                              }}>
                                                <EventIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.secondary.main }} />
                                                {pref.eventType}
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                          <TableCell>
                                            <motion.div
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                            >
                                              <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                borderRadius: 1,
                                                background: alpha(theme.palette.primary.main, 0.05)
                                              }}>
                                                <LocationOnIcon sx={{ mr: 1, fontSize: 16, color: theme.palette.primary.main }} />
                                                {pref.preferredVenue}
                                              </Box>
                                            </motion.div>
                                          </TableCell>
                                        </motion.tr>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </motion.div>
            )}

            </AnimatePresence> 
          </Container>
        </Box>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
