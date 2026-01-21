// frontend/src/components/booking/BookingManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, 
  IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Select, 
  FormControl, InputLabel, Typography, Box, 
  CircularProgress, Alert, Chip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getBookings, 
  getAllBookings,
  createBooking, 
  updateBookingStatus, 
  deleteBooking,
  assignStaffToBooking,
  cancelBooking 
} from '../../services/bookingService';
import { checkBookingConflicts } from '../../services/staffAvailabilityService';
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBooking, setNewBooking] = useState({
    service: '',
    eventType: 'wedding',
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    eventLocation: '',
    guestCount: '',
    specialRequests: '',
    status: 'Inquiry'
  });
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use getAllBookings for admin, getBookings for regular users
      const response = user?.role === 'admin' ? await getAllBookings() : await getBookings();
      
      if (response.success) {
        setBookings(Array.isArray(response.data) ? response.data : []);
        console.log(`✅ Loaded ${response.data?.length || 0} bookings for ${user?.role || 'user'}`);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Listen for booking refresh events
    const handleBookingRefresh = () => {
      console.log('🔄 Booking refresh triggered');
      fetchBookings();
    };
    
    // Listen for custom event
    window.addEventListener('bookingRefresh', handleBookingRefresh);
    
    // Also check localStorage trigger
    const checkLocalStorageTrigger = () => {
      const trigger = localStorage.getItem('bookingRefreshTrigger');
      if (trigger) {
        console.log('🔄 LocalStorage booking refresh triggered');
        fetchBookings();
        localStorage.removeItem('bookingRefreshTrigger');
      }
    };
    
    // Check localStorage every 2 seconds
    const interval = setInterval(checkLocalStorageTrigger, 2000);
    
    // Cleanup
    return () => {
      window.removeEventListener('bookingRefresh', handleBookingRefresh);
      clearInterval(interval);
    };
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setNewBooking({
      service: '',
      eventType: 'wedding',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      eventLocation: '',
      guestCount: '',
      specialRequests: '',
      status: 'Inquiry'
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewBooking({
      service: '',
      eventType: 'wedding',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      eventLocation: '',
      guestCount: '',
      specialRequests: '',
      status: 'Inquiry'
    });
  };

const handleCreateBooking = async () => {
  try {
    if (!newBooking.eventDate || !newBooking.eventLocation || !newBooking.guestCount) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check for booking conflicts first
    const conflictData = {
      date: newBooking.eventDate,
      startTime: '09:00', // Default start time (you might want to add this to form)
      endTime: '17:00'   // Default end time (you might want to add this to form)
    };

    const conflictCheck = await checkBookingConflicts(conflictData);
    
    if (conflictCheck.hasConflicts) {
      toast.error(`Booking conflicts found: ${conflictCheck.conflicts.length} existing booking(s) at the same time`);
      return;
    }

    // Use the service ID we just created
    const bookingData = {
      service: '696084c33d7a9dace9f7c48b', // Wedding Planning service ID
      eventType: newBooking.eventType,
      eventDate: newBooking.eventDate,
      eventLocation: newBooking.eventLocation,
      guestCount: parseInt(newBooking.guestCount),
      specialRequests: newBooking.specialRequests,
      status: newBooking.status
    };

    console.log('Creating booking with data:', bookingData);
    const response = await createBooking(bookingData);
    setBookings([...bookings, response.data]);
    toast.success('Booking created successfully');
    handleCloseDialog();
  } catch (error) {
    console.error('Error creating booking:', error);
    
    // Handle conflict errors specifically
    if (error.response?.status === 409) {
      toast.error(error.response?.data?.error || 'Booking time conflict detected');
    } else {
      toast.error(error.response?.data?.message || error.message || 'Failed to create booking');
    }
  }
};
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? response.data : booking
      ));
      toast.success('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await cancelBooking(bookingId);
        setBookings(bookings.map(booking => 
          booking._id === bookingId ? response.data : booking
        ));
        toast.success('Booking cancelled successfully');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId);
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        toast.success('Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        toast.error(error.response?.data?.message || 'Failed to delete booking');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      inquiry: 'default',
      quoted: 'warning',
      confirmed: 'success',
      inprogress: 'info',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Booking
        </Button>
      </Box>

      {error && bookings.length === 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Alert severity="info">No bookings found</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Event Type</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Guests</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Payment</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell sx={{ textTransform: 'capitalize' }}>
                    {booking.eventType}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.eventDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.eventLocation}</TableCell>
                  <TableCell>{booking.guestCount}</TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.status.toUpperCase()} 
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {booking.paymentStatus ? booking.paymentStatus.toUpperCase() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={booking.paymentStatus ? booking.paymentStatus.toUpperCase() : 'N/A'}
                      color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleCancelBooking(booking._id)}
                        title="Cancel booking"
                      >
                        <CancelIcon />
                      </IconButton>
                    )}
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={() => handleDelete(booking._id)}
                      title="Delete booking"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* New Booking Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Booking</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={newBooking.eventType}
                onChange={(e) => setNewBooking({ ...newBooking, eventType: e.target.value })}
                label="Event Type"
              >
                <MenuItem value="wedding">Wedding</MenuItem>
                <MenuItem value="birthday">Birthday</MenuItem>
                <MenuItem value="corporate">Corporate</MenuItem>
                <MenuItem value="anniversary">Anniversary</MenuItem>
                <MenuItem value="graduation">Graduation</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Booking Status</InputLabel>
              <Select
                value={newBooking.status}
                onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
                label="Booking Status"
              >
                <MenuItem value="Inquiry">Inquiry</MenuItem>
                <MenuItem value="Quoted">Quoted</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Service"
              value={newBooking.service}
              onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
              placeholder="Enter service ID or name"
            />

            <TextField
              fullWidth
              type="date"
              label="Event Date"
              value={newBooking.eventDate}
              onChange={(e) => setNewBooking({ ...newBooking, eventDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Event Location"
              value={newBooking.eventLocation}
              onChange={(e) => setNewBooking({ ...newBooking, eventLocation: e.target.value })}
              placeholder="Enter event location"
            />

            <TextField
              fullWidth
              type="number"
              label="Guest Count"
              value={newBooking.guestCount}
              onChange={(e) => setNewBooking({ ...newBooking, guestCount: parseInt(e.target.value) })}
              inputProps={{ min: 1 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Requests"
              value={newBooking.specialRequests}
              onChange={(e) => setNewBooking({ ...newBooking, specialRequests: e.target.value })}
              placeholder="Any special requirements or requests?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateBooking} variant="contained" color="primary">
            Create Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingManagement;