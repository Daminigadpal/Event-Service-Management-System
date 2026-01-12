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
  CardContent
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CheckCircle as AvailableIcon,
  Cancel as BusyIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState([]);
  const [dailySchedule, setDailySchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    staff: '',
    date: '',
    timeSlots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }],
    status: 'available',
    notes: ''
  });

  useEffect(() => {
    fetchAvailabilityForMonth();
  }, [selectedDate]);

  const fetchAvailabilityForMonth = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

      const response = await getStaffAvailability({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });

      if (response.success) {
        setAvailabilityData(response.data);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailySchedule = async (date) => {
    try {
      const response = await getDailySchedule(date.toISOString().split('T')[0]);
      if (response.success) {
        setDailySchedule(response.data);
      }
    } catch (err) {
      console.error('Error fetching daily schedule:', err);
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
      <Grid container spacing={1} sx={{ mb: 2 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Grid item xs={12/7} key={day}>
            <Typography variant="caption" fontWeight="bold" textAlign="center">
              {day}
            </Typography>
          </Grid>
        ))}

        {calendarDays.map((day, index) => {
          if (!day) {
            return <Grid item xs={12/7} key={`empty-${index}`} />;
          }

          const availability = getAvailabilityForDate(day);
          let color = 'default';
          let icon = null;

          if (availability) {
            switch (availability.status) {
              case 'available':
                color = 'success';
                icon = <AvailableIcon fontSize="small" />;
                break;
              case 'busy':
                color = 'error';
                icon = <BusyIcon fontSize="small" />;
                break;
              case 'off':
                color = 'default';
                break;
            }
          }

          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <Grid item xs={12/7} key={day.toISOString()}>
              <Card
                sx={{
                  height: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: isToday ? '2px solid blue' : '1px solid #ddd',
                  backgroundColor: color === 'success' ? '#e8f5e8' :
                                  color === 'error' ? '#ffebee' : '#f5f5f5',
                  '&:hover': {
                    backgroundColor: color === 'success' ? '#c8e6c9' :
                                    color === 'error' ? '#ffcdd2' : '#e0e0e0'
                  }
                }}
                onClick={() => handleDateClick(day)}
              >
                <Typography variant="body2" fontWeight={isToday ? 'bold' : 'normal'}>
                  {day.getDate()}
                </Typography>
                {icon && (
                  <Box sx={{ mt: 0.5 }}>
                    {icon}
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
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
      <Typography variant="h4" mb={3}>
        Staff Availability Calendar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Calendar */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}
                >
                  Previous
                </Button>
                <Typography variant="h6">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}
                >
                  Next
                </Button>
              </Box>
              {!readOnly && (
                <Button
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  onClick={handleOpenDialog}
                >
                  Set Availability
                </Button>
              )}
            </Box>

            {renderCalendar()}
          </Paper>
        </Grid>

        {/* Daily Schedule */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>
              📅 Daily Schedule - {selectedDate.toLocaleDateString()}
            </Typography>

            {dailySchedule ? (
              <Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  📊 Total Bookings: {dailySchedule.summary.totalBookings}
                </Typography>

                {/* Enhanced Schedule View */}
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    📋 All Booked Time Slots
                  </Typography>
                  
                  {dailySchedule.bookings.length > 0 ? (
                    dailySchedule.bookings.map((booking, index) => (
                      <Box key={booking._id} sx={{ 
                        mb: 2, 
                        p: 2, 
                        border: '1px solid #ddd', 
                        borderRadius: 1,
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              🕐 Time Slot
                            </Typography>
                            <Typography variant="h6">
                              {new Date(booking.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              📝 Service Details
                            </Typography>
                            <Typography><strong>Service:</strong> {booking.service?.name || 'N/A'}</Typography>
                            <Typography><strong>Customer:</strong> {booking.customer?.name || 'N/A'}</Typography>
                            <Typography><strong>Event Type:</strong> {booking.eventType || 'N/A'}</Typography>
                            <Typography><strong>Location:</strong> {booking.eventLocation || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              📊 Status & Actions
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Chip
                                label={booking.status}
                                size="small"
                                color={booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'default'}
                              />
                              <Typography variant="caption" sx={{ ml: 1 }}>
                                Created: {new Date(booking.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                      📭 No bookings scheduled for this day
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                📅 Select a date to view schedule
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Set Availability Dialog - Only show if not readOnly */}
      {!readOnly && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Set Staff Availability</DialogTitle>
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
                />

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    label="Status"
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="busy">Busy</MenuItem>
                    <MenuItem value="off">Off</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="subtitle1" mb={1}>
                    Time Slots
                  </Typography>
                  {formData.timeSlots.map((slot, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <TextField
                        label="Start Time"
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="End Time"
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveTimeSlot(index)}
                        color="error"
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddTimeSlot}
                    variant="outlined"
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
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Saving...' : 'Save Availability'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </Box>
  );
};

export default AvailabilityCalendar;
