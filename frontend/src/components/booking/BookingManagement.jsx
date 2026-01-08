// frontend/src/components/booking/BookingManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, 
  IconButton, MenuItem, Select, 
  FormControl, InputLabel, Typography,
  Box, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getBookings, 
  createBooking, 
  updateBookingStatus, 
  deleteBooking,
  assignStaffToBooking 
} from '../../services/bookingService';
import { toast } from 'react-toastify';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBookings();
      if (response.success) {
        setBookings(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
      // Fallback to mock data if available
      if (bookings.length === 0) {
        setBookings(mockBookings);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, { status: newStatus });
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      toast.success('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId);
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        toast.success('Booking deleted successfully');
      } catch (error) {
        console.error('Error deleting booking:', error);
        toast.error(error.response?.data?.message || 'Failed to delete booking');
      }
    }
  };

 const handleStaffAssignment = async (bookingId, staffId) => {
  try {
    await assignStaffToBooking(bookingId, staffId);
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { 
        ...booking, 
        staff: staffId,
        staffName: STAFF_MEMBERS.find(s => s.id === staffId)?.name || 'Unknown'
      } : booking
    ));
    toast.success('Staff assigned successfully');
  } catch (error) {
    console.error('Error assigning staff:', error);
    toast.error(error.response?.data?.message || 'Failed to assign staff');
  }
};
// Update the staff selection dropdown
<Select
  value={booking.staff || ''}
  onChange={(e) => handleStaffAssignment(booking.id, e.target.value)}
  size="small"
>
  <MenuItem value="1">John Doe</MenuItem>
  <MenuItem value="2">Jane Smith</MenuItem>
  <MenuItem value="3">Mike Johnson</MenuItem>
  <MenuItem value="4">Sarah Williams</MenuItem>
</Select>
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error} - Using mock data for demonstration
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.eventType}</TableCell>
                <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Inquiry">Inquiry</MenuItem>
                    <MenuItem value="Quoted">Quoted</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{booking.guests}</TableCell>
                <TableCell>${booking.amount}</TableCell>
                <TableCell>
                  <Select
                    value={booking.staff || ''}
                    onChange={(e) => handleStaffAssignment(booking.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="John Doe">John Doe</MenuItem>
                    <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                    <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
                    <MenuItem value="Sarah Williams">Sarah Williams</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleStatusChange(booking.id, 'Completed')}
                    disabled={booking.status === 'Completed'}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton 
                    color="secondary" 
                    onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                    disabled={booking.status === 'Cancelled'}
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(booking.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookingManagement;