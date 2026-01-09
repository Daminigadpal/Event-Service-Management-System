// frontend/src/components/scheduling/ScheduleView.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  ViewWeek as WeekIcon,
  ViewDay as DayIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getDailySchedule, getStaffAvailability } from '../../services/staffAvailabilityService';

const ScheduleView = () => {
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');

  useEffect(() => {
    fetchScheduleData();
  }, [selectedDate, viewMode, selectedStaff]);

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (viewMode === 'day') {
        // Fetch daily schedule
        const response = await getDailySchedule(
          selectedDate.toISOString().split('T')[0],
          selectedStaff || null
        );
        
        if (response.success) {
          setScheduleData(response.data);
        }
      } else {
        // Fetch weekly data
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const response = await getStaffAvailability({
          startDate: weekStart.toISOString().split('T')[0],
          endDate: weekEnd.toISOString().split('T')[0],
          staffId: selectedStaff || null
        });

        if (response.success) {
          setAvailabilityData(response.data);
        }
      }
    } catch (err) {
      console.error('Error fetching schedule data:', err);
      setError('Failed to load schedule data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    
    setSelectedDate(newDate);
  };

  const getWeekDays = () => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const getBookingsForTimeSlot = (date, time) => {
    if (!scheduleData?.bookings) return [];
    
    return scheduleData.bookings.filter(booking => {
      const bookingTime = new Date(booking.eventDate);
      return bookingTime.toDateString() === date.toDateString() &&
             bookingTime.getHours() === parseInt(time.split(':')[0]);
    });
  };

  const renderDayView = () => {
    if (!scheduleData) return null;

    const timeSlots = getTimeSlots();
    const currentDate = selectedDate.toDateString();

    return (
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
          <Box>
            <Button onClick={() => handleDateChange(-1)}>Previous</Button>
            <Button onClick={() => handleDateChange(1)}>Next</Button>
          </Box>
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Typography variant="subtitle2" fontWeight="bold">Time</Typography>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="subtitle2" fontWeight="bold">Bookings</Typography>
          </Grid>
          
          {timeSlots.map((time) => {
            const bookings = getBookingsForTimeSlot(selectedDate, time);
            return (
              <Grid container item spacing={1} key={time} sx={{ minHeight: '60px' }}>
                <Grid item xs={2}>
                  <Typography variant="body2">{time}</Typography>
                </Grid>
                <Grid item xs={10}>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <Card key={booking._id} sx={{ mb: 1, backgroundColor: '#f5f5f5' }}>
                        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="body2" fontWeight="bold">
                            {booking.service?.name}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Customer: {booking.customer?.name}
                          </Typography>
                          <Typography variant="caption" display="block">
                            Location: {booking.eventLocation}
                          </Typography>
                          <Chip 
                            label={booking.status} 
                            size="small" 
                            color={booking.status === 'confirmed' ? 'success' : 'default'}
                          />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Box sx={{ height: '40px', borderLeft: '2px dashed #ccc', pl: 1 }} />
                  )}
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    );
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const timeSlots = getTimeSlots();

    return (
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Week of {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
          </Typography>
          <Box>
            <Button onClick={() => handleDateChange(-7)}>Previous Week</Button>
            <Button onClick={() => handleDateChange(7)}>Next Week</Button>
          </Box>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Grid container spacing={1} sx={{ minWidth: '800px' }}>
            {/* Header row */}
            <Grid item xs={1}>
              <Typography variant="subtitle2" fontWeight="bold">Time</Typography>
            </Grid>
            {weekDays.map((day, index) => (
              <Grid item xs={1.5} key={index}>
                <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </Typography>
                <Typography variant="caption" textAlign="center" display="block">
                  {day.getDate()}
                </Typography>
              </Grid>
            ))}

            {/* Time slots */}
            {timeSlots.map((time) => (
              <Grid container item spacing={1} key={time}>
                <Grid item xs={1}>
                  <Typography variant="body2">{time}</Typography>
                </Grid>
                {weekDays.map((day, dayIndex) => {
                  const dayAvailability = availabilityData.find(avail => 
                    new Date(avail.date).toDateString() === day.toDateString()
                  );
                  
                  return (
                    <Grid item xs={1.5} key={dayIndex}>
                      <Box
                        sx={{
                          height: '40px',
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          p: 0.5,
                          backgroundColor: dayAvailability?.status === 'available' ? '#e8f5e8' :
                                          dayAvailability?.status === 'busy' ? '#ffebee' : '#f5f5f5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px'
                        }}
                      >
                        {dayAvailability?.status === 'available' && '✓'}
                        {dayAvailability?.status === 'busy' && '✗'}
                        {dayAvailability?.status === 'off' && '—'}
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle2">Legend:</Typography>
          <Box display="flex" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#e8f5e8', border: '1px solid #ddd' }} />
              <Typography variant="caption">Available</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#ffebee', border: '1px solid #ddd' }} />
              <Typography variant="caption">Busy</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#f5f5f5', border: '1px solid #ddd' }} />
              <Typography variant="caption">Off</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    );
  };

  if (loading && !scheduleData && availabilityData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Schedule Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="day">
                <DayIcon />
                Day
              </ToggleButton>
              <ToggleButton value="week">
                <WeekIcon />
                Week
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          
          <Grid item>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Staff Filter</InputLabel>
              <Select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                label="Staff Filter"
              >
                <MenuItem value="">All Staff</MenuItem>
                {/* Add staff options here */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Schedule View */}
      {viewMode === 'day' ? renderDayView() : renderWeekView()}
    </Box>
  );
};

export default ScheduleView;
