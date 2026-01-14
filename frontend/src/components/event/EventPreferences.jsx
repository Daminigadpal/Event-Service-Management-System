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

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('=== Starting loadPreferences ===');
      
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = user.role === 'admin';
      console.log('User data:', user);
      console.log('Is admin:', isAdmin);
      
      const endpoint = isAdmin ? 'event-preferences/all' : 'event-preferences';
      console.log(`Using ${isAdmin ? 'admin' : 'user'} endpoint: ${endpoint}`);
      
      const axios = require('axios');
      const response = await axios.get(`http://localhost:5000/api/v1/${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Direct API response:', response.data);
      console.log('Response status:', response.status);
      
      let data = [];
      if (response.data) {
        if (response.data.success && response.data.data) {
          data = response.data.data;
          console.log('Using response.data.success + response.data.data format');
        } else if (Array.isArray(response.data)) {
          data = response.data;
          console.log('Using direct array format');
        } else {
          console.warn('Unknown response format:', response.data);
          data = [];
        }
      } else {
        console.warn('No response received');
        data = [];
      }
      
      console.log('Final processed data:', data);
      console.log('Data length:', data.length);
      console.log('Data is array:', Array.isArray(data));
      
      setPreferences(data);
      
      if (data.length === 0) {
        console.log('No event preferences found in database');
      } else {
        console.log('Found', data.length, 'event preferences in database');
        data.slice(0, 3).forEach((pref, index) => {
          console.log(`Preference ${index + 1}:`, pref);
        });
      }
    } catch (error) {
      console.error('Error loading event preferences:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to load event preferences: ${errorMessage}`);
      
      setPreferences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (preference = null) => {
    if (preference) {
      setCurrentPreference({
        ...preference,
        budgetRange: typeof preference.budgetRange === 'object' 
          ? `$${preference.budgetRange.min}-${preference.budgetRange.max}`
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
      if (isEditing) {
        await updateEventPreference({ ...currentPreference, id: currentPreference._id || currentPreference.id });
        toast.success('Event preference updated successfully');
      } else {
        await createEventPreference(currentPreference);
        toast.success('Event preference created successfully');
      }
      await loadPreferences();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving event preference:', error);
      toast.error(error.response?.data?.message || 'Failed to save event preference');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event preference?')) {
      try {
        await deleteEventPreference(id);
        toast.success('Event preference deleted successfully');
        await loadPreferences();
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
                      ? `$${preference.budgetRange.min}-$${preference.budgetRange.max}`
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
