// frontend/src/components/payment/PaymentManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
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
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Description as DescriptionIcon,
  AccountBalance as AccountBalanceIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  getPayments,
  createPayment,
  generateQuotation,
  getInvoices,
  createInvoice,
  updatePaymentStatus,
  getPaymentSummary
} from '../../services/paymentService.js';
import {
  getBookings
} from '../../services/bookingService.js';
import {
  getEventPreferences
} from '../../services/eventPreferenceService.js';
import { useAuth } from '../../contexts/AuthContext';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQuotationDialog, setOpenQuotationDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [bookings, setBookings] = useState([]); // Add bookings state
  const [userProfile, setUserProfile] = useState({}); // Add user profile state
  const [eventPreferences, setEventPreferences] = useState({}); // Add event preferences state
  const [formData, setFormData] = useState({
    booking: '',
    paymentType: 'advance',
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });
  const { user } = useAuth();

  console.log('PaymentManagement component rendering'); // Debug log

  useEffect(() => {
    console.log('PaymentManagement useEffect triggered');
    fetchPayments();
    fetchInvoices();
    fetchBookings(); // Fetch bookings data
    fetchUserProfile(); // Fetch user profile
    fetchEventPreferences(); // Fetch event preferences
  }, []);

  const fetchBookings = async () => {
    try {
      // Fetch real bookings from database
      const response = await getBookings();
      if (response.success) {
        setBookings(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error('Failed to fetch bookings:', response.message);
        setBookings([]);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    }
  };

  const fetchUserProfile = async () => {
    try {
      // Use user data from AuthContext instead of API call
      if (user) {
        setUserProfile({
          name: user.name || 'User',
          email: user.email || 'user@example.com',
          phone: user.phone || 'Not provided',
          address: user.address || 'Not provided'
        });
      } else {
        console.log('No user data available in AuthContext');
        setUserProfile({});
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setUserProfile({});
    }
  };

  const fetchEventPreferences = async () => {
    try {
      // Fetch real event preferences from database
      const response = await getEventPreferences();
      if (response.success && response.data && response.data.length > 0) {
        const pref = response.data[0]; // Get first preference
        setEventPreferences({
          preferredEventTypes: pref.eventType || 'Not specified',
          preferredLocations: pref.preferredVenue || 'Not specified',
          budgetRange: pref.budgetRange || 'Not specified',
          specialRequirements: pref.notes || 'None'
        });
      } else {
        console.log('No event preferences found, using defaults');
        setEventPreferences({
          preferredEventTypes: 'Not specified',
          preferredLocations: 'Not specified',
          budgetRange: 'Not specified',
          specialRequirements: 'None'
        });
      }
    } catch (err) {
      console.error('Error fetching event preferences:', err);
      setEventPreferences({
        preferredEventTypes: 'Not specified',
        preferredLocations: 'Not specified',
        budgetRange: 'Not specified',
        specialRequirements: 'None'
      });
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPayments();
      if (response.success) {
        setPayments(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error('Failed to fetch payments:', response.message);
        setPayments([]);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await getInvoices();
      if (response.success) {
        setInvoices(Array.isArray(response.data) ? response.data : []);
      } else {
        console.error('Failed to fetch invoices:', response.message);
        setInvoices([]);
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setInvoices([]);
    }
  };

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setSelectedPayment(payment);
      setFormData({
        booking: payment.booking?._id || '',
        paymentType: payment.paymentType || 'advance',
        amount: payment.amount || '',
        paymentMethod: payment.paymentMethod || 'cash',
        transactionId: payment.transactionId || '',
        notes: payment.notes || ''
      });
    } else {
      setFormData({
        booking: '',
        paymentType: 'advance',
        amount: '',
        paymentMethod: 'cash',
        transactionId: '',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
    setFormData({
      booking: '',
      paymentType: 'advance',
      amount: '',
      paymentMethod: 'cash',
      transactionId: '',
      notes: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPayment) {
        // Update payment
        await updatePaymentStatus(selectedPayment._id, { status: formData.status || 'paid' });
        toast.success('Payment updated successfully');
      } else {
        // Create new payment
        await createPayment(formData);
        toast.success('Payment recorded successfully');
      }
      fetchPayments();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error(error.response?.data?.error || 'Failed to save payment');
    }
  };

  const handleGenerateQuotation = async (bookingId) => {
    try {
      await generateQuotation({ bookingId, taxRate: 18, notes: 'Quotation for event services' });
      toast.success('Quotation generated successfully');
      fetchInvoices();
    } catch (error) {
      console.error('Error generating quotation:', error);
      toast.error('Failed to generate quotation');
    }
  };

  const handleCreateInvoice = async (bookingId) => {
    try {
      // Get booking details first
      const summary = await getPaymentSummary(bookingId);
      const items = [
        {
          description: summary.data.booking.service,
          quantity: 1,
          unitPrice: summary.data.booking.totalAmount,
          total: summary.data.booking.totalAmount
        }
      ];
      
      await createInvoice({
        bookingId,
        items,
        taxRate: 18,
        notes: 'Final invoice for event services',
        terms: 'Payment due within 30 days'
      });
      toast.success('Invoice created successfully');
      fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        // For now, just remove from local state
        setPayments(payments.filter(p => p._id !== paymentId));
        toast.success('Payment deleted successfully');
      } catch (error) {
        console.error('Error deleting payment:', error);
        toast.error('Failed to delete payment');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      partial: 'info',
      paid: 'success',
      failed: 'error',
      refunded: 'error'
    };
    return colors[status] || 'default';
  };

  const getPaymentTypeColor = (type) => {
    const colors = {
      advance: 'primary',
      balance: 'secondary',
      full: 'success'
    };
    return colors[type] || 'default';
  };

  const getInvoiceTypeColor = (type) => {
    const colors = {
      quotation: 'info',
      proforma: 'warning',
      final: 'primary'
    };
    return colors[type] || 'default';
  };

  const renderPaymentsTable = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Booking</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
            <TableCell><strong>Method</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell>
                {new Date(payment.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {payment.booking?.eventType}
                </Typography>
                <Typography variant="caption" display="block">
                  {new Date(payment.booking?.eventDate).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={payment.paymentType}
                  color={getPaymentTypeColor(payment.paymentType)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                ₹{payment.amount.toLocaleString()}
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={payment.status}
                  color={getStatusColor(payment.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => handleOpenDialog(payment)}
                  title="Edit payment"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDeletePayment(payment._id)}
                  title="Delete payment"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderInvoicesTable = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><strong>Invoice #</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Booking</strong></TableCell>
            <TableCell><strong>Total</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {invoice.invoiceNumber}
                </Typography>
                <Typography variant="caption" display="block">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={invoice.invoiceType.toUpperCase()}
                  color={getInvoiceTypeColor(invoice.invoiceType)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {invoice.booking?.eventType}
                </Typography>
                <Typography variant="caption" display="block">
                  {new Date(invoice.booking?.eventDate).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                ₹{invoice.totalAmount.toLocaleString()}
              </TableCell>
              <TableCell>
                <Chip
                  label={invoice.status}
                  color={getStatusColor(invoice.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  size="small"
                  title="Download PDF"
                >
                  <PdfIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  console.log('PaymentManagement rendering with data:', {
    payments: payments.length,
    invoices: invoices.length,
    bookings: bookings.length,
    userProfile: Object.keys(userProfile).length,
    eventPreferences: Object.keys(eventPreferences).length
  });

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Payment & Invoice Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Payments" icon={<ReceiptIcon />} />
          <Tab label="📋 Complete Dashboard" icon={<DescriptionIcon />} />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Payment
            </Button>
          </Box>
          {payments.length === 0 ? (
            <Alert severity="info">No payments found</Alert>
          ) : (
            renderPaymentsTable()
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" mb={3}>Complete Dashboard Data</Typography>
          
          {/* User Profile Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Profile</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>Name:</strong> {userProfile.name || 'N/A'}</Typography>
                <Typography><strong>Email:</strong> {userProfile.email || 'N/A'}</Typography>
                <Typography><strong>Phone:</strong> {userProfile.phone || 'N/A'}</Typography>
                <Typography><strong>Address:</strong> {userProfile.address || 'N/A'}</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Bookings Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Bookings</Typography>
              {bookings.length === 0 ? (
                <Alert severity="info">No bookings found</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {bookings.map((booking) => (
                    <Box key={booking._id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography><strong>Event Type:</strong> {booking.eventType}</Typography>
                      <Typography><strong>Event Date:</strong> {new Date(booking.eventDate).toLocaleDateString()}</Typography>
                      <Typography><strong>Location:</strong> {booking.eventLocation}</Typography>
                      <Typography><strong>Status:</strong> 
                        <Chip 
                          label={booking.status} 
                          color={booking.status === 'confirmed' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Event Preferences Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Event Preferences</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>Preferred Event Types:</strong> {eventPreferences.preferredEventTypes || 'Not specified'}</Typography>
                <Typography><strong>Preferred Locations:</strong> {eventPreferences.preferredLocations || 'Not specified'}</Typography>
                <Typography><strong>Budget Range:</strong> {eventPreferences.budgetRange || 'Not specified'}</Typography>
                <Typography><strong>Special Requirements:</strong> {eventPreferences.specialRequirements || 'None'}</Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Payment History Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment History</Typography>
              {payments.length === 0 ? (
                <Alert severity="info">No payments found</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {payments.map((payment) => (
                    <Box key={payment._id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleDateString()}</Typography>
                      <Typography><strong>Type:</strong> {payment.paymentType}</Typography>
                      <Typography><strong>Amount:</strong> ₹{payment.amount.toLocaleString()}</Typography>
                      <Typography><strong>Method:</strong> {payment.paymentMethod}</Typography>
                      <Typography><strong>Status:</strong> 
                        <Chip 
                          label={payment.status} 
                          color={getStatusColor(payment.status)} 
                          size="small" 
                        />
                      </Typography>
                      <Typography><strong>Receipt:</strong> {payment.receiptNumber}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Invoice History Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Invoice History</Typography>
              {invoices.length === 0 ? (
                <Alert severity="info">No invoices found</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {invoices.map((invoice) => (
                    <Box key={invoice._id} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography><strong>Invoice #:</strong> {invoice.invoiceNumber}</Typography>
                      <Typography><strong>Type:</strong> {invoice.invoiceType}</Typography>
                      <Typography><strong>Total:</strong> ₹{invoice.totalAmount?.toLocaleString() || '0'}</Typography>
                      <Typography><strong>Status:</strong> 
                        <Chip 
                          label={invoice.status} 
                          color={getStatusColor(invoice.status)} 
                          size="small" 
                        />
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Summary Statistics</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography><strong>Total Bookings:</strong> {bookings.length}</Typography>
                <Typography><strong>Total Payments:</strong> {payments.length}</Typography>
                <Typography><strong>Total Invoices:</strong> {invoices.length}</Typography>
                <Typography><strong>Total Amount Paid:</strong> ₹{payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}</Typography>
                <Typography><strong>Total Invoice Amount:</strong> ₹{invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0).toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPayment ? 'Update Payment' : 'Record Payment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Booking ID"
                value={formData.booking}
                onChange={(e) => setFormData({ ...formData, booking: e.target.value })}
                required
                helperText="Enter the booking ID (e.g., 67890abcd1234ef567890abcd1234ef56789)"
              />
              
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  value={formData.paymentType}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                  label="Payment Type"
                >
                  <MenuItem value="advance">Advance</MenuItem>
                  <MenuItem value="balance">Balance</MenuItem>
                  <MenuItem value="full">Full Payment</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                InputProps={{ min: 0 }}
              />

              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  label="Payment Method"
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="card">Credit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Transaction ID"
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              />

              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedPayment ? 'Update' : 'Record'} Payment
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PaymentManagement;
