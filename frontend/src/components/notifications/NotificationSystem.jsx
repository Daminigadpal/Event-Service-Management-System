import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, Chip, Card, CardContent, Grid, Tabs, Tab,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import {
  Email as EmailIcon,
  Sms as SmsIcon,
  Send as SendIcon,
  History as HistoryIcon,
  Campaign as CampaignIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { notificationService } from '../../services/notificationService';

const NotificationSystem = ({ userRole = 'admin', currentUser = null }) => {
  console.log('🔔 NotificationSystem component rendering...', { userRole, currentUser });
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Form state
  const [notificationForm, setNotificationForm] = useState({
    type: 'email',
    to: '',
    subject: '',
    message: '',
    recipients: [] // For bulk notifications
  });

  // Mock notification history - filtered by current user
  const [notificationHistory, setNotificationHistory] = useState([
    {
      id: 1,
      type: 'email',
      recipient: currentUser?.email || 'customer@example.com',
      subject: 'Booking Confirmation',
      message: 'Your wedding booking has been confirmed',
      status: 'sent',
      timestamp: '2024-01-15T10:30:00Z',
      sender: 'Admin'
    },
    {
      id: 2,
      type: 'sms',
      recipient: currentUser?.phone || '+1234567890',
      subject: 'Payment Reminder',
      message: 'Payment due for your event booking',
      status: 'sent',
      timestamp: '2024-01-15T09:15:00Z',
      sender: 'System'
    },
    {
      id: 3,
      type: 'email',
      recipient: currentUser?.email || 'customer@example.com',
      subject: 'Event Update',
      message: 'Your event details have been updated',
      status: 'sent',
      timestamp: '2024-01-14T15:45:00Z',
      sender: 'Admin'
    },
    {
      id: 4,
      type: 'email',
      recipient: currentUser?.email || 'customer@example.com',
      subject: 'Event Reminder',
      message: 'Reminder: Your event is scheduled for tomorrow',
      status: 'sent',
      timestamp: '2024-01-13T08:00:00Z',
      sender: 'System'
    }
  ].filter(notification => {
    // Filter notifications to show only those for the current user
    if (!currentUser) return false;
    return notification.recipient === currentUser.email || notification.recipient === currentUser.phone;
  }));

  const templates = notificationService.getTemplates();

  const handleSendNotification = async () => {
    if (!notificationForm.to || (!notificationForm.subject && notificationForm.type === 'email') || !notificationForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (notificationForm.type === 'email') {
        result = await notificationService.sendEmail({
          to: notificationForm.to,
          subject: notificationForm.subject,
          body: notificationForm.message
        });
      } else {
        result = await notificationService.sendSMS({
          to: notificationForm.to,
          message: notificationForm.message
        });
      }

      if (result.success) {
        toast.success(`${notificationForm.type === 'email' ? 'Email' : 'SMS'} sent successfully!`);
        
        // Add to history
        const newNotification = {
          id: Date.now(),
          type: notificationForm.type,
          recipient: notificationForm.to,
          subject: notificationForm.subject || 'SMS Notification',
          message: notificationForm.message,
          status: 'sent',
          timestamp: new Date().toISOString(),
          sender: userRole.charAt(0).toUpperCase() + userRole.slice(1)
        };
        setNotificationHistory([newNotification, ...notificationHistory]);
        
        // Reset form
        setNotificationForm({
          type: 'email',
          to: '',
          subject: '',
          message: '',
          recipients: []
        });
        setSendDialogOpen(false);
      } else {
        toast.error('Failed to send notification');
      }
    } catch (error) {
      toast.error('Error sending notification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (templateKey) => {
    const template = templates[templateKey];
    if (template && notificationForm.type === 'email') {
      setNotificationForm({
        ...notificationForm,
        subject: template.email.subject,
        message: template.email.body
      });
    } else if (template && notificationForm.type === 'sms') {
      setNotificationForm({
        ...notificationForm,
        subject: '',
        message: template.sms
      });
    }
    setTemplateDialogOpen(false);
  };

  const handleBulkSend = async () => {
    if (notificationForm.recipients.length === 0) {
      toast.error('Please select recipients');
      return;
    }

    setLoading(true);
    try {
      const bulkNotifications = notificationForm.recipients.map(recipient => ({
        type: notificationForm.type,
        data: {
          to: recipient.email || recipient.phone,
          subject: notificationForm.subject,
          body: notificationForm.message,
          message: notificationForm.message
        }
      }));

      const results = await notificationService.sendBulkNotifications(bulkNotifications);
      
      const successCount = results.filter(r => r.result.success).length;
      toast.success(`Bulk send completed: ${successCount}/${results.length} sent successfully`);
      
      setSendDialogOpen(false);
    } catch (error) {
      toast.error('Error in bulk send: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSendNotification = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <CampaignIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Send Notification
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Notification Type</InputLabel>
              <Select
                value={notificationForm.type}
                onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
              >
                <MenuItem value="email">📧 Email</MenuItem>
                <MenuItem value="sms">📱 SMS</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={notificationForm.type === 'email' ? "Email Address" : "Phone Number"}
              value={notificationForm.to}
              onChange={(e) => setNotificationForm({ ...notificationForm, to: e.target.value })}
              margin="normal"
            />
          </Grid>
          
          {notificationForm.type === 'email' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={notificationForm.subject}
                onChange={(e) => setNotificationForm({ ...notificationForm, subject: e.target.value })}
                margin="normal"
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              multiline
              rows={4}
              value={notificationForm.message}
              onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
              margin="normal"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CampaignIcon />}
                onClick={() => setTemplateDialogOpen(true)}
              >
                Use Template
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendNotification}
                disabled={loading}
              >
                {loading ? <CircularProgress size={20} /> : 'Send'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderNotificationHistory = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {userRole === 'customer' ? 'Your Notification History' : 'Notification History'}
        </Typography>
        
        {notificationHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {userRole === 'customer' ? 'You have no notifications yet.' : 'No notifications found.'}
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Timestamp</TableCell>
                  {userRole !== 'customer' && <TableCell>Sender</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {notificationHistory.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>
                      <Chip
                        icon={notification.type === 'email' ? <EmailIcon /> : <SmsIcon />}
                        label={notification.type === 'email' ? 'Email' : 'SMS'}
                        size="small"
                        color={notification.type === 'email' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>{notification.subject}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {notification.message}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.status}
                        size="small"
                        color={notification.status === 'sent' ? 'success' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(notification.timestamp).toLocaleString()}
                    </TableCell>
                    {userRole !== 'customer' && <TableCell>{notification.sender}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const renderTemplates = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <CampaignIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Notification Templates
        </Typography>
        
        <Grid container spacing={2}>
          {Object.keys(templates).map((templateKey) => (
            <Grid item xs={12} md={6} key={templateKey}>
              <Paper sx={{ p: 2, cursor: 'pointer' }} onClick={() => handleUseTemplate(templateKey)}>
                <Typography variant="subtitle2" gutterBottom>
                  {templateKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Subject: {templates[templateKey].email.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  SMS: {templates[templateKey].sms}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notification System
      </Typography>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Send Notification" />
        <Tab label="History" />
        <Tab label="Templates" />
      </Tabs>

      {activeTab === 0 && renderSendNotification()}
      {activeTab === 1 && renderNotificationHistory()}
      {activeTab === 2 && renderTemplates()}

      {/* Template Selection Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Select Template</DialogTitle>
        <DialogContent>
          <List>
            {Object.keys(templates).map((templateKey) => (
              <ListItem 
                key={templateKey} 
                button 
                onClick={() => handleUseTemplate(templateKey)}
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
              >
                <ListItemText
                  primary={templateKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email: {templates[templateKey].email.subject}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SMS: {templates[templateKey].sms}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationSystem;
