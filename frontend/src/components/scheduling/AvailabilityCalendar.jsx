// frontend/src/components/scheduling/AvailabilityCalendar.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  IconButton,
  Badge,
  LinearProgress,
  Fab,
  useTheme,
  alpha
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as AvailableIcon,
  Cancel as BusyIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Today as TodayIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import {
  getStaffAvailability,
  setStaffAvailability,
  getDailySchedule
} from '../../services/staffAvailabilityService';

const AvailabilityCalendar = ({ readOnly = false }) => {
  const { user } = useAuth();
  const theme = useTheme();
  console.log('👤 AvailabilityCalendar rendering for user:', { name: user?.name, role: user?.role, id: user?.id });
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState([]);
  const [dailySchedule, setDailySchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'available', 'busy', 'off'
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [formData, setFormData] = useState({
    staff: '',
    date: '',
    timeSlots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }],
    status: 'available',
    notes: ''
  });

  useEffect(() => {
    fetchAvailabilityForMonth();
  }, [selectedDate, viewMode]);

  const fetchAvailabilityForMonth = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      console.log('🗓️ Fetching availability for:', {
        userRole: user?.role,
        userId: user?.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      // Show all staff availability for all users (same as admin view)
      const params = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      };
      
      // Don't filter by staffId - show all staff availability
      console.log('📤 API call params (showing all staff):', params);
      const response = await getStaffAvailability(params);
      console.log('📥 API response:', response);

      if (response.success) {
        setAvailabilityData(response.data);
        console.log(`✅ Loaded ${response.data?.length || 0} availability records`);
      } else {
        console.error('❌ API returned unsuccessful response:', response);
        setError('Failed to load availability data');
      }
    } catch (err) {
      console.error('❌ Error fetching availability:', err);
      setError('Failed to load availability data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchDailySchedule = async (date) => {
    try {
      console.log('📅 Fetching daily schedule for:', date.toISOString().split('T')[0]);
      
      // Show all bookings for all users (same as admin view)
      const response = await getDailySchedule(date.toISOString().split('T')[0]);
      console.log('📅 Daily schedule response:', response);
      
      if (response.success) {
        setDailySchedule(response.data);
        console.log(`✅ Loaded daily schedule with ${response.data?.bookings?.length || 0} bookings`);
      } else {
        console.error('❌ Failed to load daily schedule:', response);
      }
    } catch (err) {
      console.error('❌ Error fetching daily schedule:', err);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchDailySchedule(date);
  };

  const handleOpenDialog = () => {
    if (readOnly) return;
    setFormData({
      staff: user?.id || '',
      date: selectedDate.toISOString().split('T')[0],
      timeSlots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }],
      status: 'available',
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '09:00', endTime: '17:00', isAvailable: true }]
    }));
  };

  const handleRemoveTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await setStaffAvailability(formData);
      toast.success('Availability set successfully');
      handleCloseDialog();
      fetchAvailabilityForMonth();
      fetchDailySchedule(selectedDate);
    } catch (err) {
      console.error('Error setting availability:', err);
      toast.error(err.response?.data?.error || 'Failed to set availability');
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availabilityData.find(avail =>
      new Date(avail.date).toISOString().split('T')[0] === dateStr
    );
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dailySchedule?.bookings?.filter(booking => {
      const bookingDate = new Date(booking.eventDate).toISOString().split('T')[0];
      return bookingDate === dateStr;
    }) || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return theme.palette.success.main;
      case 'busy': return theme.palette.error.main;
      case 'off': return theme.palette.grey[500];
      default: return theme.palette.grey[300];
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'available': return alpha(theme.palette.success.main, 0.1);
      case 'busy': return alpha(theme.palette.error.main, 0.1);
      case 'off': return alpha(theme.palette.grey[500], 0.1);
      default: return alpha(theme.palette.grey[300], 0.1);
    }
  };

  const renderCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day));
    }

    return (
      <Box>
        {/* Enhanced Calendar Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          borderRadius: 2,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Fab 
              size="small" 
              color="secondary" 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setSelectedDate(newDate);
              }}
            >
              <ArrowBackIcon />
            </Fab>
            <Typography variant="h6" fontWeight="bold">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
            <Fab 
              size="small" 
              color="secondary" 
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setSelectedDate(newDate);
              }}
            >
              <ArrowForwardIcon />
            </Fab>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'month' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setViewMode('month')}
              startIcon={<CalendarIcon />}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'week' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setViewMode('week')}
              startIcon={<ScheduleIcon />}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setViewMode('day')}
              startIcon={<TodayIcon />}
            >
              Day
            </Button>
          </Box>

          <Button
            variant="contained"
            startIcon={<TodayIcon />}
            onClick={() => setSelectedDate(new Date())}
            sx={{ backgroundColor: 'white', color: theme.palette.primary.main }}
          >
            Today
          </Button>
        </Box>

        {/* Weekday Headers */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Grid item xs={12/7} key={day}>
              <Typography 
                variant="caption" 
                fontWeight="bold" 
                textAlign="center" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  py: 1,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 1
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar Days */}
        <Grid container spacing={1}>
          {calendarDays.map((day, index) => {
            if (!day) {
              return <Grid item xs={12/7} key={`empty-${index}`} />;
            }

            const availability = getAvailabilityForDate(day);
            const bookings = getBookingsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            
            let statusColor = theme.palette.grey[300];
            let statusBg = alpha(theme.palette.grey[300], 0.1);
            let icon = null;
            let badge = null;

            // Check for bookings first (highest priority)
            if (bookings.length > 0) {
              statusColor = theme.palette.warning.main;
              statusBg = alpha(theme.palette.warning.main, 0.1);
              icon = <EventIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />;
              badge = (
                <Badge 
                  badgeContent={bookings.length} 
                  color="warning"
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      fontSize: '10px', 
                      height: '16px', 
                      minWidth: '16px' 
                    } 
                  }}
                />
              );
            } else if (availability) {
              statusColor = getStatusColor(availability.status);
              statusBg = getStatusBgColor(availability.status);
              icon = availability.status === 'available' ? 
                <AvailableIcon fontSize="small" sx={{ color: statusColor }} /> :
                availability.status === 'busy' ?
                <BusyIcon fontSize="small" sx={{ color: statusColor }} /> : null;
            }

            return (
              <Grid item xs={12/7} key={day.toISOString()}>
                <Tooltip 
                  title={`${day.toLocaleDateString()} - ${bookings.length > 0 ? `${bookings.length} bookings` : availability?.status || 'No data'}`}
                  arrow
                >
                  <Card
                    sx={{
                      height: 80,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: isToday ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
                      backgroundColor: statusBg,
                      borderRadius: 2,
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: theme.shadows[4],
                        backgroundColor: alpha(statusColor, 0.2)
                      }
                    }}
                    onClick={() => handleDateClick(day)}
                  >
                    <Typography 
                      variant="body2" 
                      fontWeight={isToday ? 'bold' : 'medium'}
                      sx={{ 
                        color: isToday ? theme.palette.primary.main : theme.palette.text.primary,
                        mb: 0.5
                      }}
                    >
                      {day.getDate()}
                    </Typography>
                    
                    {icon && (
                      <Box sx={{ position: 'absolute', top: 2, right: 2 }}>
                        {icon}
                      </Box>
                    )}
                    
                    {badge && (
                      <Box sx={{ position: 'absolute', top: 2, left: 2 }}>
                        {badge}
                      </Box>
                    )}

                    {bookings.length > 0 && (
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontSize: '8px', 
                          color: theme.palette.warning.dark,
                          fontWeight: 'bold',
                          position: 'absolute',
                          bottom: 2
                        }}
                      >
                        {bookings.length}
                      </Typography>
                    )}
                  </Card>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  if (loading && availabilityData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Enhanced Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          📅 {user?.role === 'admin' ? 'Staff' : 'View Staff'} Availability Calendar
        </Typography>
      </Box>

      {/* Enhanced Legend */}
      <Paper sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.dark, 0.1)})` }}>
        <Typography variant="h6" mb={2} sx={{ color: theme.palette.info.dark }}>
          📊 Calendar Legend
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: getStatusBgColor('available'),
              border: `1px solid ${getStatusColor('available')}`
            }}>
              <AvailableIcon sx={{ color: getStatusColor('available') }} />
              <Typography variant="body2" fontWeight="medium">
                Available
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: getStatusBgColor('busy'),
              border: `1px solid ${getStatusColor('busy')}`
            }}>
              <EventIcon sx={{ color: getStatusColor('busy') }} />
              <Typography variant="body2" fontWeight="medium">
                Booked
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: getStatusBgColor('off'),
              border: `1px solid ${getStatusColor('off')}`
            }}>
              <BusyIcon sx={{ color: getStatusColor('off') }} />
              <Typography variant="body2" fontWeight="medium">
                Off/Busy
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.grey[300], 0.1),
              border: `1px solid ${theme.palette.grey[300]}`
            }}>
              <ScheduleIcon sx={{ color: theme.palette.grey[500] }} />
              <Typography variant="body2" fontWeight="medium">
                No Data
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Enhanced Calendar */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ 
            p: 3, 
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            {renderCalendar()}
          </Paper>
        </Grid>

        {/* Enhanced Daily Schedule */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)}, ${alpha(theme.palette.secondary.dark, 0.1)})`,
            maxHeight: 600,
            overflow: 'auto'
          }}>
            <Typography variant="h6" mb={2} sx={{ color: theme.palette.secondary.dark }}>
              📋 Daily Schedule
            </Typography>

            {dailySchedule ? (
              <Box>
                {/* Summary Stats */}
                <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    📊 Summary for {selectedDate.toLocaleDateString()}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Bookings
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        {dailySchedule.summary?.totalBookings || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Available Slots
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {dailySchedule.summary?.availableSlots || 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Availability Status */}
                {(() => {
                  const availability = getAvailabilityForDate(selectedDate);
                  if (availability) {
                    return (
                      <Box sx={{ 
                        mb: 3, 
                        p: 2, 
                        backgroundColor: getStatusBgColor(availability.status), 
                        borderRadius: 2,
                        border: `1px solid ${getStatusColor(availability.status)}`
                      }}>
                        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: getStatusColor(availability.status) }}>
                          {availability.status === 'available' ? '✅ Staff Available' : 
                           availability.status === 'busy' ? '❌ Staff Busy' : '⚪ Staff Off'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Status: <strong>{availability.status}</strong>
                        </Typography>
                        {availability.timeSlots?.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Time Slots:
                            </Typography>
                            {availability.timeSlots.map((slot, i) => (
                              <Chip 
                                key={i}
                                label={`${slot.startTime} - ${slot.endTime}`}
                                size="small"
                                sx={{ m: 0.5 }}
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    );
                  }
                  return null;
                })()}

                {/* Enhanced Bookings List */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    📅 Booked Events
                  </Typography>
                  
                  {dailySchedule.bookings && dailySchedule.bookings.length > 0 ? (
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                      {dailySchedule.bookings.map((booking, index) => (
                        <Card 
                          key={booking._id} 
                          sx={{ 
                            mb: 2, 
                            p: 2,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows[4]
                            }
                          }}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setBookingDetailsOpen(true);
                          }}
                        >
                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                <EventIcon />
                              </Avatar>
                            </Grid>
                            <Grid item xs>
                              <Typography variant="body2" fontWeight="bold" color="primary.main">
                                {new Date(booking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.eventType || 'Event'}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Customer:</strong> {booking.customer?.name || 'N/A'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {booking.eventLocation || 'Location N/A'}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Chip
                                  label={booking.status}
                                  size="small"
                                  color={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'default'}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(booking.createdAt).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item>
                              <IconButton size="small">
                                <ZoomInIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      p: 3, 
                      textAlign: 'center', 
                      backgroundColor: alpha(theme.palette.grey[300], 0.1),
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        📭 No bookings scheduled for this day
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ 
                p: 3, 
                textAlign: 'center', 
                backgroundColor: alpha(theme.palette.grey[300], 0.1),
                borderRadius: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                  📅 Select a date to view schedule
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Enhanced Set Availability Dialog */}
      {!readOnly && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white'
          }}>
            ⚙️ Set Staff Availability
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <TextField
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    label="Status"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="available">✅ Available</MenuItem>
                    <MenuItem value="busy">❌ Busy</MenuItem>
                    <MenuItem value="off">⚪ Off</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle1" mb={2} sx={{ color: theme.palette.primary.main }}>
                    ⏰ Time Slots
                  </Typography>
                  {formData.timeSlots.map((slot, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      mb: 2, 
                      p: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2
                    }}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="End Time"
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        onClick={() => handleRemoveTimeSlot(index)}
                        color="error"
                        sx={{ alignSelf: 'center' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddTimeSlot}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mt: 1 }}
                  >
                    Add Time Slot
                  </Button>
                </Box>

                <TextField
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  minWidth: 120
                }}
              >
                {loading ? 'Saving...' : 'Save Availability'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={bookingDetailsOpen} onClose={() => setBookingDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>📋 Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedBooking.eventType || 'Event'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Customer:</strong> {selectedBooking.customer?.name || 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Time:</strong> {new Date(selectedBooking.eventDate).toLocaleTimeString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Location:</strong> {selectedBooking.eventLocation || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> 
                <Chip 
                  label={selectedBooking.status} 
                  size="small" 
                  color={selectedBooking.status === 'confirmed' ? 'success' : 'warning'}
                  sx={{ ml: 1 }}
                />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvailabilityCalendar;
