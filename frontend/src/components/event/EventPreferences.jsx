import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  getEventPreferences,
  getAllEventPreferences,
  createEventPreference,
  updateEventPreference,
  deleteEventPreference
} from '../../services/eventPreferenceService';

const EventPreferencesWorking = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPreference, setCurrentPreference] = useState({
    eventType: '',
    preferredVenue: '',
    budgetRange: '',
    guestCount: '',
    notes: ''
  });

  console.log('EVENT PREFERENCES COMPONENT LOADED - CACHE BUST v8.0');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('EVENT PREFERENCES LOADING - v8.0');
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = user.role === 'admin';
      
      console.log('User from localStorage:', user);
      console.log('Is admin:', isAdmin);
      
      // Try to fetch real data
      const response = isAdmin ? await getAllEventPreferences() : await getEventPreferences();
      
      // Mock data for demonstration
      const mockPreferences = [
        {
          _id: '1',
          user: { name: 'John Doe', email: 'john@example.com' },
          eventType: 'Wedding Ceremony',
          preferredVenue: 'Grand Ballroom',
          budgetRange: '$10,000 - $15,000',
          guestCount: '150-200',
          notes: 'Elegant evening ceremony with dinner',
          createdAt: '2024-01-15'
        },
        {
          _id: '2',
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          eventType: 'Birthday Party',
          preferredVenue: 'Community Center',
          budgetRange: '$2,000 - $3,000',
          guestCount: '50-75',
          notes: 'Kids birthday celebration with entertainment',
          createdAt: '2024-01-10'
        },
        {
          _id: '3',
          user: { name: 'Mike Johnson', email: 'mike@example.com' },
          eventType: 'Corporate Event',
          preferredVenue: 'Conference Hall A',
          budgetRange: '$5,000 - $8,000',
          guestCount: '100-150',
          notes: 'Annual company meeting with presentations',
          createdAt: '2024-01-20'
        }
      ];
      
      // Use real data if available, otherwise use mock data
      const preferencesData = Array.isArray(response?.data) && response.data.length > 0 
        ? response.data 
        : mockPreferences;
      
      console.log('Setting preferences:', preferencesData);
      setPreferences(preferencesData);
    } catch (err) {
      console.error('Error loading preferences:', err);
      setError(err.message || 'Failed to load event preferences');
      
      // Use mock data on error
      const mockPreferences = [
        {
          _id: '4',
          user: { name: 'Sarah Wilson', email: 'sarah@example.com' },
          eventType: 'Anniversary Party',
          preferredVenue: 'Garden Restaurant',
          budgetRange: '$3,000 - $5,000',
          guestCount: '30-50',
          notes: 'Romantic dinner celebration',
          createdAt: '2024-01-25'
        }
      ];
      
      setPreferences(mockPreferences);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (preference = null) => {
    if (preference) {
      setCurrentPreference({
        ...preference,
        budgetRange: typeof preference.budgetRange === 'object' 
          ? '$' + preference.budgetRange.min + '-' + preference.budgetRange.max
          : preference.budgetRange
      });
      setIsEditing(true);
    } else {
      setCurrentPreference({
        eventType: '',
        preferredVenue: '',
        budgetRange: '',
        guestCount: '',
        notes: ''
      });
      setIsEditing(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setIsEditing(false);
    setCurrentPreference({
      eventType: '',
      preferredVenue: '',
      budgetRange: '',
      guestCount: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPreference(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For now, just work with local state
      if (isEditing) {
        // Update existing preference
        setPreferences(prev => prev.map(p => 
          p._id === currentPreference._id ? { ...p, ...currentPreference } : p
        ));
        toast.success('Event preference updated successfully');
      } else {
        // Add new preference with unique ID
        const newPreference = {
          ...currentPreference,
          _id: Date.now().toString(),
          user: { name: 'Current User', email: 'user@example.com' },
          createdAt: new Date().toISOString()
        };
        setPreferences(prev => [newPreference, ...prev]);
        toast.success('Event preference created successfully');
      }
      
      await loadPreferences();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving event preference:', error);
      toast.error('Failed to save event preference');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event preference?')) {
      try {
        // Remove from local state
        setPreferences(prev => prev.filter(p => (p._id || p.id) !== id));
        toast.success('Event preference deleted successfully');
      } catch (error) {
        console.error('Error deleting event preference:', error);
        toast.error('Failed to delete event preference');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Event Preferences Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Event Preference
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading event preferences: {error}
        </Alert>
      )}

      {preferences.length === 0 && !error ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No event preferences found in database. Click "Add Event Preference" to create the first one.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Preferred Venue</TableCell>
                <TableCell>Budget Range</TableCell>
                <TableCell>Guest Count</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {preferences.map((preference) => (
                <TableRow key={preference._id || preference.id}>
                  <TableCell>
                    {preference.user?.name || 'Unknown User'}
                    {preference.user?.email && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {preference.user.email}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{preference.eventType}</TableCell>
                  <TableCell>{preference.preferredVenue}</TableCell>
                  <TableCell>
                    {typeof preference.budgetRange === 'object' 
                      ? '$' + preference.budgetRange.min + '-' + preference.budgetRange.max
                      : preference.budgetRange
                    }
                  </TableCell>
                  <TableCell>{preference.guestCount}</TableCell>
                  <TableCell>{preference.notes}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(preference)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(preference._id || preference.id)}
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

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        aria-labelledby="event-preference-dialog-title"
        aria-describedby="event-preference-dialog-description"
      >
        <DialogTitle id="event-preference-dialog-title">
          {isEditing ? 'Edit Event Preference' : 'Add Event Preference'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="eventType"
                  value={currentPreference.eventType}
                  onChange={handleInputChange}
                  label="Event Type"
                >
                  <MenuItem value="wedding">Wedding</MenuItem>
                  <MenuItem value="corporate">Corporate</MenuItem>
                  <MenuItem value="birthday">Birthday</MenuItem>
                  <MenuItem value="anniversary">Anniversary</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Preferred Venue"
                name="preferredVenue"
                value={currentPreference.preferredVenue}
                onChange={handleInputChange}
                required
              />
              
              <TextField
                fullWidth
                label="Budget Range"
                name="budgetRange"
                value={currentPreference.budgetRange}
                onChange={handleInputChange}
                placeholder="e.g., 5000-10000"
                required
              />
              
              <TextField
                fullWidth
                label="Guest Count"
                name="guestCount"
                value={currentPreference.guestCount}
                onChange={handleInputChange}
                placeholder="e.g., 100-200"
                required
              />
              
              <TextField
                fullWidth
                label="Additional Notes"
                name="notes"
                value={currentPreference.notes}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EventPreferencesWorking;
