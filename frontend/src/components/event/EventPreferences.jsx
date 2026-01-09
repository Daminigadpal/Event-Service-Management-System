// frontend/src/components/event/EventPreferences.jsx
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

const EventPreferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPreference, setCurrentPreference] = useState({
    eventType: '',
    preferredVenue: '',
    budgetRange: '',
    guestCount: '',
    notes: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const eventTypes = ['Wedding', 'Corporate', 'Birthday', 'Conference', 'Social'];
  const budgetRanges = ['1000-3000', '3000-5000', '5000-10000', '10000-20000', '20000+'];
  const guestCounts = ['1-50', '50-100', '100-200', '200-500', '500+'];

  const fetchEventPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEventPreferences();
      console.log('Fetched preferences response:', response);
      if (response.success) {
        const prefsArray = Array.isArray(response.data) ? response.data : [];
        console.log('Setting preferences array:', prefsArray);
        console.log('First preference details:', prefsArray[0]);
        setPreferences(prefsArray);
      } else {
        throw new Error(response.message || 'Failed to fetch event preferences');
      }
    } catch (err) {
      console.error('Error fetching event preferences:', err);
      setError(err.message || 'Failed to load event preferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventPreferences();
  }, []);

  const handleOpenDialog = (preference = null) => {
    if (preference) {
      setCurrentPreference({
        id: preference._id || preference.id,
        eventType: preference.eventType ? preference.eventType.charAt(0).toUpperCase() + preference.eventType.slice(1) : '',
        preferredVenue: preference.preferredVenue || '',
        budgetRange: preference.budgetRange && typeof preference.budgetRange === 'object' 
          ? `${preference.budgetRange.min}-${preference.budgetRange.max}`
          : preference.budgetRange || '',
        guestCount: preference.guestCount ? preference.guestCount.toString() : '',
        notes: preference.notes || ''
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
      if (isEditing && currentPreference.id) {
        await updateEventPreference(currentPreference.id, currentPreference);
        toast.success('Event preference updated successfully');
      } else {
        // Try to create first, if it fails with 400, try to update the first existing preference
        try {
          await createEventPreference(currentPreference);
          toast.success('Event preference created successfully');
        } catch (createError) {
          console.log('Create error details:', createError.response?.status, createError.response?.data);
          if (createError.response?.status === 400) {
            // User already has preferences, update the first one
            if (preferences.length > 0) {
              await updateEventPreference(preferences[0]._id || preferences[0].id, currentPreference);
              toast.success('Event preference updated successfully');
            } else {
              throw createError;
            }
          } else {
            throw createError;
          }
        }
      }
      await fetchEventPreferences();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving event preference:', error);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to save event preference');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event preference?')) {
      try {
        await deleteEventPreference(id);
        toast.success('Event preference deleted successfully');
        await fetchEventPreferences();
      } catch (error) {
        console.error('Error deleting event preference:', error);
        toast.error(error.response?.data?.message || 'Failed to delete event preference');
      }
    }
  };

  if (loading && preferences.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Event Preferences</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Event Preference
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Debug: Show preferences data */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Debug: Preferences length: {preferences.length}, Data: {JSON.stringify(preferences, null, 2)}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Type</TableCell>
              <TableCell>Preferred Venue</TableCell>
              <TableCell>Budget Range</TableCell>
              <TableCell>Guest Count</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preferences.length > 0 ? (
              preferences.map((pref) => (
                <TableRow key={pref._id || pref.id}>
                  <TableCell>{pref.eventType ? pref.eventType.charAt(0).toUpperCase() + pref.eventType.slice(1) : ''}</TableCell>
                  <TableCell>{pref.preferredVenue}</TableCell>
                  <TableCell>
                    {pref.budgetRange && typeof pref.budgetRange === 'object' 
                      ? `$${pref.budgetRange.min} - $${pref.budgetRange.max}`
                      : pref.budgetRange || ''
                    }
                  </TableCell>
                  <TableCell>{pref.guestCount}</TableCell>
                  <TableCell>{pref.notes || ''}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(pref)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(pref._id || pref.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No event preferences found. Add one to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Edit Event Preference' : 'Add New Event Preference'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="eventType"
                  value={currentPreference.eventType}
                  onChange={handleInputChange}
                  label="Event Type"
                  required
                >
                  {eventTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                name="preferredVenue"
                label="Preferred Venue"
                value={currentPreference.preferredVenue}
                onChange={handleInputChange}
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Budget Range</InputLabel>
                <Select
                  name="budgetRange"
                  value={currentPreference.budgetRange}
                  onChange={handleInputChange}
                  label="Budget Range"
                  required
                >
                  {budgetRanges.map((range) => (
                    <MenuItem key={range} value={range}>
                      ${range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Guest Count</InputLabel>
                <Select
                  name="guestCount"
                  value={currentPreference.guestCount}
                  onChange={handleInputChange}
                  label="Guest Count"
                  required
                >
                  {guestCounts.map((count) => (
                    <MenuItem key={count} value={count}>
                      {count}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                name="notes"
                label="Additional Notes"
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

export default EventPreferences;