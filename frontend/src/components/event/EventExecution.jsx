// frontend/src/components/event/EventExecution.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, Chip, Tabs, Tab, Grid, Card, CardContent,
  LinearProgress, Rating, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Upload as UploadIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import {
  getEventExecutions,
  getAllEventExecutions,
  createEventExecution,
  markEventCompleted,
  uploadDeliverable,
  verifyDeliverable,
  submitClientFeedback
} from '../../services/eventExecutionService.js';
import { getBookings } from '../../services/bookingService.js';

const EventExecution = () => {
  const { user } = useAuth();
  const [executions, setExecutions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Dialog states
  const [openExecutionDialog, setOpenExecutionDialog] = useState(false);
  const [openDeliverableDialog, setOpenDeliverableDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  
  // Form states
  const [executionForm, setExecutionForm] = useState({
    bookingId: '',
    staffAssigned: [],
    notes: ''
  });
  
  const [deliverableForm, setDeliverableForm] = useState({
    name: '',
    description: '',
    fileUrl: '',
    fileType: '',
    fileSize: 0
  });
  
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comments: '',
    wouldRecommend: true,
    suggestions: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch executions
      const executionsResponse = user?.role === 'admin' 
        ? await getAllEventExecutions() 
        : await getEventExecutions();
      
      // Fetch bookings for dropdown
      const bookingsResponse = await getBookings();
      
      setExecutions(Array.isArray(executionsResponse.data) ? executionsResponse.data : []);
      setBookings(Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExecution = async () => {
    try {
      await createEventExecution(executionForm);
      toast.success('Event execution created successfully');
      setOpenExecutionDialog(false);
      setExecutionForm({ bookingId: '', staffAssigned: [], notes: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create execution');
    }
  };

  const handleMarkCompleted = async (executionId) => {
    try {
      await markEventCompleted(executionId, 'Event completed successfully');
      toast.success('Event marked as completed');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as completed');
    }
  };

  const handleUploadDeliverable = async () => {
    try {
      await uploadDeliverable(selectedExecution._id, deliverableForm);
      toast.success('Deliverable uploaded successfully');
      setOpenDeliverableDialog(false);
      setDeliverableForm({ name: '', description: '', fileUrl: '', fileType: '', fileSize: 0 });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload deliverable');
    }
  };

  const handleVerifyDeliverable = async (executionId, deliverableId) => {
    try {
      await verifyDeliverable(executionId, deliverableId, 'Deliverable verified successfully');
      toast.success('Deliverable verified successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify deliverable');
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      await submitClientFeedback(selectedExecution._id, feedbackForm);
      toast.success('Client feedback submitted successfully');
      setOpenFeedbackDialog(false);
      setFeedbackForm({ rating: 5, comments: '', wouldRecommend: true, suggestions: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      in_progress: 'warning',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getDeliverableStatusColor = (status) => {
    const colors = {
      pending: 'default',
      in_progress: 'warning',
      completed: 'info',
      verified: 'success'
    };
    return colors[status] || 'default';
  };

  const calculateProgress = (execution) => {
    if (execution.totalDeliverables === 0) return 0;
    return (execution.completedDeliverables / execution.totalDeliverables) * 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Event Execution & Deliverables
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Active Events" />
          <Tab label="Completed Events" />
          {user?.role === 'admin' && <Tab label="All Events" />}
        </Tabs>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {activeTab === 0 ? 'Active Events' : activeTab === 1 ? 'Completed Events' : 'All Events'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenExecutionDialog(true)}
        >
          Create Execution
        </Button>
      </Box>

      {executions.length === 0 ? (
        <Alert severity="info">No event executions found</Alert>
      ) : (
        <Grid container spacing={3}>
          {executions
            .filter(execution => {
              if (activeTab === 0) return execution.status === 'in_progress';
              if (activeTab === 1) return execution.status === 'completed';
              return true;
            })
            .map((execution) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={execution._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {execution.booking?.eventType?.charAt(0).toUpperCase() + execution.booking?.eventType?.slice(1)}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {execution.booking?.eventLocation}
                    </Typography>
                    
                    <Typography variant="body2" gutterBottom>
                      Date: {new Date(execution.booking?.eventDate).toLocaleDateString()}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={execution.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(execution.status)}
                        size="small"
                      />
                    </Box>

                    {execution.deliverables && execution.deliverables.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Deliverables: {execution.completedDeliverables}/{execution.totalDeliverables}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(execution)}
                          sx={{ mb: 1 }}
                        />
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {execution.status === 'in_progress' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleMarkCompleted(execution._id)}
                        >
                          Mark Completed
                        </Button>
                      )}
                      
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => {
                          setSelectedExecution(execution);
                          setOpenDeliverableDialog(true);
                        }}
                      >
                        Upload Deliverable
                      </Button>
                      
                      {execution.status === 'completed' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedExecution(execution);
                            setOpenFeedbackDialog(true);
                          }}
                        >
                          Add Feedback
                        </Button>
                      )}
                    </Box>

                    {/* Deliverables Section */}
                    {execution.deliverables && execution.deliverables.length > 0 && (
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2">Deliverables ({execution.deliverables.length})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {execution.deliverables.map((deliverable, index) => (
                            <Box key={index} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {deliverable.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {deliverable.description}
                              </Typography>
                              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={deliverable.status.toUpperCase()}
                                  color={getDeliverableStatusColor(deliverable.status)}
                                  size="small"
                                />
                                {deliverable.status === 'completed' && deliverable.status !== 'verified' && (
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleVerifyDeliverable(execution._id, deliverable._id)}
                                  >
                                    <VerifiedIcon />
                                  </IconButton>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    )}

                    {/* Client Feedback Section */}
                    {execution.clientFeedback && (
                      <Accordion sx={{ mt: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2">Client Feedback</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ mb: 2 }}>
                            <Rating value={execution.clientFeedback.rating} readOnly size="small" />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {execution.clientFeedback.comments}
                            </Typography>
                            {execution.clientFeedback.suggestions && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                <strong>Suggestions:</strong> {execution.clientFeedback.suggestions}
                              </Typography>
                            )}
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Create Execution Dialog */}
      <Dialog open={openExecutionDialog} onClose={() => setOpenExecutionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Event Execution</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Booking</InputLabel>
              <Select
                value={executionForm.bookingId}
                onChange={(e) => setExecutionForm({ ...executionForm, bookingId: e.target.value })}
                label="Booking"
              >
                {bookings.map((booking) => (
                  <MenuItem key={booking._id} value={booking._id}>
                    {booking.eventType} - {booking.eventLocation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={executionForm.notes}
              onChange={(e) => setExecutionForm({ ...executionForm, notes: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExecutionDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateExecution} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Upload Deliverable Dialog */}
      <Dialog open={openDeliverableDialog} onClose={() => setOpenDeliverableDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Deliverable</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Deliverable Name"
                  value={deliverableForm.name}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="File Type"
                  value={deliverableForm.fileType}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, fileType: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={deliverableForm.description}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, description: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="File URL"
                  value={deliverableForm.fileUrl}
                  onChange={(e) => setDeliverableForm({ ...deliverableForm, fileUrl: e.target.value })}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeliverableDialog(false)}>Cancel</Button>
          <Button onClick={handleUploadDeliverable} variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      {/* Client Feedback Dialog */}
      <Dialog open={openFeedbackDialog} onClose={() => setOpenFeedbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Client Feedback</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={feedbackForm.rating}
                onChange={(e, newValue) => setFeedbackForm({ ...feedbackForm, rating: newValue })}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Comments"
              multiline
              rows={3}
              value={feedbackForm.comments}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Suggestions"
              multiline
              rows={2}
              value={feedbackForm.suggestions}
              onChange={(e) => setFeedbackForm({ ...feedbackForm, suggestions: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitFeedback} variant="contained">Submit Feedback</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventExecution;
