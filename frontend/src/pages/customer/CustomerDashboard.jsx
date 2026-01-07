import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, Tab, Box, Typography, 
  Paper, Grid, Avatar, Button, 
  List, ListItem, ListItemText, Divider,
  Chip, TextField, MenuItem, FormControl,
  InputLabel, Select, FormHelperText
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Event as EventIcon, 
  Note as NoteIcon, 
  Settings as SettingsIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { format } from 'date-fns';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `customer-tab-${index}`,
    'aria-controls': `customer-tabpanel-${index}`,
  };
}

const CustomerDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [newNote, setNewNote] = useState('');
  const [newPreference, setNewPreference] = useState({
    eventType: '',
    budgetRange: { min: '', max: '' },
    preferredLocations: [],
    specialRequirements: ''
  });
  
  const navigate = useNavigate();

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/customers/me');
        setCustomer(response.data.data);
        setFormData({
          firstName: response.data.data.firstName || '',
          lastName: response.data.data.lastName || '',
          phone: response.data.data.phone || '',
          address: response.data.data.address || {}
        });
      } catch (err) {
        setError('Failed to load customer data');
        console.error('Error fetching customer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleSaveField = async () => {
    try {
      const response = await api.put(`/customers/${customer._id}`, formData);
      setCustomer(response.data.data);
      setEditingField(null);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating customer:', err);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const response = await api.post(`/customers/${customer._id}/notes`, {
        content: newNote,
        type: 'general'
      });
      setCustomer(response.data.data);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note');
      console.error('Error adding note:', err);
    }
  };

  const handleAddPreference = async () => {
    try {
      const response = await api.post(`/customers/${customer._id}/preferences`, newPreference);
      setCustomer(response.data.data);
      setNewPreference({
        eventType: '',
        budgetRange: { min: '', max: '' },
        preferredLocations: [],
        specialRequirements: ''
      });
    } catch (err) {
      setError('Failed to add preference');
      console.error('Error adding preference:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!customer) {
    return <div>Customer not found</div>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4">
              {customer.firstName} {customer.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {customer.isRepeatCustomer ? 'Repeat Customer' : 'New Customer'}
            </Typography>
          </Box>
        </Box>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="customer dashboard tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Profile" icon={<PersonIcon />} {...a11yProps(0)} />
          <Tab label="Preferences" icon={<SettingsIcon />} {...a11yProps(1)} />
          <Tab label="Bookings" icon={<EventIcon />} {...a11yProps(2)} />
          <Tab label="Notes" icon={<NoteIcon />} {...a11yProps(3)} />
        </Tabs>
      </Box>

      {error && (
        <Box sx={{ color: 'error.main', mb: 2 }}>{error}</Box>
      )}

      {/* Profile Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Personal Information</Typography>
                {editingField === 'personal' ? (
                  <Box>
                    <Button 
                      size="small" 
                      onClick={() => setEditingField(null)}
                      startIcon={<CloseIcon />}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      onClick={handleSaveField}
                      startIcon={<CheckIcon />}
                      sx={{ ml: 1 }}
                    >
                      Save
                    </Button>
                  </Box>
                ) : (
                  <Button 
                    size="small" 
                    onClick={() => handleEditField('personal')}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                )}
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    fullWidth
                    margin="normal"
                    disabled={editingField !== 'personal'}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    fullWidth
                    margin="normal"
                    disabled={editingField !== 'personal'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    value={customer.user?.email || ''}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    fullWidth
                    margin="normal"
                    disabled={editingField !== 'personal'}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Account Stats</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Member Since" 
                    secondary={customer.createdAt ? format(new Date(customer.createdAt), 'MMMM d, yyyy') : 'N/A'} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Total Bookings" 
                    secondary={customer.totalBookings || 0} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Last Booking" 
                    secondary={customer.lastBookingDate ? format(new Date(customer.lastBookingDate), 'MMMM d, yyyy') : 'No bookings yet'} 
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText 
                    primary="Customer Status" 
                    secondary={
                      <Chip 
                        label={customer.status || 'active'} 
                        color={customer.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    } 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Preferences Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Event Preferences</Typography>
          
          {customer.preferences?.length > 0 ? (
            <Grid container spacing={2}>
              {customer.preferences.map((pref, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {pref.eventType}
                      </Typography>
                      <Chip 
                        label={pref.isActive ? 'Active' : 'Inactive'} 
                        size="small" 
                        color={pref.isActive ? 'success' : 'default'}
                      />
                    </Box>
                    {pref.budgetRange && (
                      <Typography variant="body2" color="text.secondary">
                        Budget: ${pref.budgetRange.min} - ${pref.budgetRange.max}
                      </Typography>
                    )}
                    {pref.preferredLocations?.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" fontWeight="bold">Preferred Locations:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {pref.preferredLocations.map((loc, i) => (
                            <Chip key={i} label={loc} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    {pref.specialRequirements && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" fontWeight="bold">Special Requirements:</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pref.specialRequirements}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No preferences added yet.</Typography>
          )}
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Add New Preference</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={newPreference.eventType}
                    onChange={(e) => setNewPreference({...newPreference, eventType: e.target.value})}
                    label="Event Type"
                  >
                    <MenuItem value="wedding">Wedding</MenuItem>
                    <MenuItem value="corporate">Corporate</MenuItem>
                    <MenuItem value="birthday">Birthday</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Min Budget"
                  type="number"
                  value={newPreference.budgetRange.min}
                  onChange={(e) => setNewPreference({
                    ...newPreference, 
                    budgetRange: {...newPreference.budgetRange, min: e.target.value}
                  })}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Max Budget"
                  type="number"
                  value={newPreference.budgetRange.max}
                  onChange={(e) => setNewPreference({
                    ...newPreference, 
                    budgetRange: {...newPreference.budgetRange, max: e.target.value}
                  })}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Special Requirements"
                  value={newPreference.specialRequirements}
                  onChange={(e) => setNewPreference({
                    ...newPreference, 
                    specialRequirements: e.target.value
                  })}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAddPreference}
                  disabled={!newPreference.eventType}
                >
                  Add Preference
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </TabPanel>

      {/* Bookings Tab */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Booking History</Typography>
          {customer.bookings?.length > 0 ? (
            <List>
              {customer.bookings.map((booking) => (
                <React.Fragment key={booking._id}>
                  <ListItem 
                    button 
                    onClick={() => navigate(`/bookings/${booking._id}`)}
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemText
                      primary={booking.service?.name || 'Service not available'}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {booking.eventDate && format(new Date(booking.eventDate), 'MMMM d, yyyy h:mm a')}
                          </Typography>
                          {' — '}
                          <Chip 
                            label={booking.status || 'pending'} 
                            size="small" 
                            color={
                              booking.status === 'confirmed' ? 'success' : 
                              booking.status === 'cancelled' ? 'error' : 'default'
                            }
                          />
                        </>
                      }
                    />
                    <Typography variant="body2" color="text.secondary">
                      ${booking.service?.price || '0.00'}
                    </Typography>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <EventIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="subtitle1" color="text.secondary">
                No bookings found
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/book-event')}
              >
                Book an Event
              </Button>
            </Box>
          )}
        </Paper>
      </TabPanel>

      {/* Notes Tab */}
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Communication Notes</Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Add a new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                Add Note
              </Button>
            </Box>
          </Box>
          
          {customer.communicationNotes?.length > 0 ? (
            <List>
              {customer.communicationNotes.map((note, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2">
                            {note.createdBy?.name || 'System'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(note.createdAt), 'MMM d, yyyy h:mm a')}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'inline' }}
                          >
                            {note.content}
                          </Typography>
                          {note.status === 'resolved' && (
                            <Chip 
                              label="Resolved" 
                              size="small" 
                              color="success"
                              sx={{ ml: 1, mt: 0.5 }}
                            />
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < customer.communicationNotes.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <NoteIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="subtitle1" color="text.secondary">
                No communication notes yet
              </Typography>
            </Box>
          )}
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default CustomerDashboard;
