import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, LinearProgress, Avatar, Rating, Button, Tabs, Tab,
  FormControl, InputLabel, Select, MenuItem, TextField,
  IconButton, Tooltip, CircularProgress, Alert, Fade, Slide
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Comment as CommentIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Send as SendIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ClientFeedbackAnalytics = () => {
  console.log('📊 ClientFeedbackAnalytics component rendering...');
  const [activeTab, setActiveTab] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    clientName: '',
    clientEmail: '',
    eventName: '',
    serviceType: '',
    rating: 5,
    feedback: '',
    category: 'service_quality'
  });
  const [submitting, setSubmitting] = useState(false);

  // Mock feedback data
  const mockFeedbackData = [
    {
      id: 1,
      clientName: 'Rahul Sharma',
      clientEmail: 'rahul.sharma@email.com',
      eventName: 'Wedding Ceremony',
      serviceType: 'Photography',
      rating: 5,
      feedback: 'Excellent photography service! Very professional and captured all the special moments perfectly.',
      sentiment: 'positive',
      category: 'service_quality',
      date: '2024-01-10',
      responseTime: '2 hours',
      resolved: true,
      staffMember: 'John Doe'
    },
    {
      id: 2,
      clientName: 'Priya Patel',
      clientEmail: 'priya.patel@email.com',
      eventName: 'Birthday Party',
      serviceType: 'Decoration',
      rating: 4,
      feedback: 'Great decoration work, but could improve on timing.',
      sentiment: 'positive',
      category: 'timing',
      date: '2024-01-09',
      responseTime: '4 hours',
      resolved: true,
      staffMember: 'Jane Smith'
    },
    {
      id: 3,
      clientName: 'Amit Kumar',
      clientEmail: 'amit.kumar@email.com',
      eventName: 'Corporate Event',
      serviceType: 'Videography',
      rating: 2,
      feedback: 'Video quality was not as expected. Poor lighting in some shots.',
      sentiment: 'negative',
      category: 'service_quality',
      date: '2024-01-08',
      responseTime: '1 hour',
      resolved: true,
      staffMember: 'Mike Johnson'
    },
    {
      id: 4,
      clientName: 'Sneha Reddy',
      clientEmail: 'sneha.reddy@email.com',
      eventName: 'Anniversary Party',
      serviceType: 'Catering',
      rating: 5,
      feedback: 'Amazing food and service! All guests loved it.',
      sentiment: 'positive',
      category: 'service_quality',
      date: '2024-01-07',
      responseTime: '30 minutes',
      resolved: true,
      staffMember: 'Sarah Wilson'
    },
    {
      id: 5,
      clientName: 'Vikram Singh',
      clientEmail: 'vikram.singh@email.com',
      eventName: 'Product Launch',
      serviceType: 'Event Management',
      rating: 3,
      feedback: 'Event was well organized but some coordination issues.',
      sentiment: 'neutral',
      category: 'coordination',
      date: '2024-01-06',
      responseTime: '6 hours',
      resolved: false,
      staffMember: 'Tom Brown'
    }
  ];

  const mockAnalytics = {
    totalFeedback: 156,
    averageRating: 4.2,
    positiveFeedback: 124,
    negativeFeedback: 18,
    neutralFeedback: 14,
    responseRate: 89,
    averageResponseTime: '2.5 hours',
    resolvedIssues: 142,
    pendingIssues: 14,
    topRatedServices: [
      { name: 'Photography', rating: 4.8, feedbackCount: 45 },
      { name: 'Catering', rating: 4.6, feedbackCount: 38 },
      { name: 'Decoration', rating: 4.3, feedbackCount: 32 }
    ],
    improvementAreas: [
      { category: 'Timing', count: 23, percentage: 15 },
      { category: 'Communication', count: 18, percentage: 12 },
      { category: 'Service Quality', count: 15, percentage: 10 }
    ],
    monthlyTrend: [
      { month: 'Jan', rating: 4.1, feedback: 28 },
      { month: 'Feb', rating: 4.3, feedback: 32 },
      { month: 'Mar', rating: 4.5, feedback: 35 },
      { month: 'Apr', rating: 4.2, feedback: 29 },
      { month: 'May', rating: 4.4, feedback: 31 },
      { month: 'Jun', rating: 4.6, feedback: 33 }
    ]
  };

  useEffect(() => {
    setFeedbackData(mockFeedbackData);
    setAnalytics(mockAnalytics);
    setLoading(false);
  }, []);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      case 'neutral': return 'warning';
      default: return 'default';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'error';
  };

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesPeriod = filterPeriod === 'all' || 
      (filterPeriod === 'week' && new Date(feedback.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterPeriod === 'month' && new Date(feedback.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const matchesRating = filterRating === 'all' || feedback.rating.toString() === filterRating;
    
    return matchesPeriod && matchesRating;
  });

  const exportFeedback = () => {
    const csvContent = [
      ['Client Name', 'Email', 'Event', 'Service', 'Rating', 'Feedback', 'Date', 'Status'],
      ...filteredFeedback.map(f => [
        f.clientName,
        f.clientEmail,
        f.eventName,
        f.serviceType,
        f.rating,
        f.feedback,
        f.date,
        f.resolved ? 'Resolved' : 'Pending'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client-feedback.csv';
    a.click();
    toast.success('Feedback data exported successfully!');
  };

  const handleFeedbackFormChange = (e) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFeedbackForm(prev => ({
      ...prev,
      rating: newValue
    }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!feedbackForm.clientName || !feedbackForm.clientEmail || !feedbackForm.eventName || 
        !feedbackForm.serviceType || !feedbackForm.feedback) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      // Create new feedback entry
      const newFeedback = {
        id: Date.now(),
        clientName: feedbackForm.clientName,
        clientEmail: feedbackForm.clientEmail,
        eventName: feedbackForm.eventName,
        serviceType: feedbackForm.serviceType,
        rating: feedbackForm.rating,
        feedback: feedbackForm.feedback,
        sentiment: feedbackForm.rating >= 4 ? 'positive' : feedbackForm.rating >= 3 ? 'neutral' : 'negative',
        category: feedbackForm.category,
        date: new Date().toISOString().split('T')[0],
        responseTime: 'Just now',
        resolved: false,
        staffMember: 'System'
      };

      // Add to feedback data
      setFeedbackData(prev => [newFeedback, ...prev]);
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalFeedback: prev.totalFeedback + 1,
        positiveFeedback: feedbackForm.rating >= 4 ? prev.positiveFeedback + 1 : prev.positiveFeedback,
        negativeFeedback: feedbackForm.rating < 3 ? prev.negativeFeedback + 1 : prev.negativeFeedback,
        neutralFeedback: feedbackForm.rating === 3 ? prev.neutralFeedback + 1 : prev.neutralFeedback,
        averageRating: ((prev.averageRating * prev.totalFeedback) + feedbackForm.rating) / (prev.totalFeedback + 1)
      }));

      // Reset form
      setFeedbackForm({
        clientName: '',
        clientEmail: '',
        eventName: '',
        serviceType: '',
        rating: 5,
        feedback: '',
        category: 'service_quality'
      });

      toast.success('Feedback submitted successfully!');
      
    } catch (error) {
      toast.error('Failed to submit feedback: ' + error.message);
    } finally {
      setSubmitting(false);
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
    <Box>
      <Typography variant="h4" gutterBottom>
        📊 Client Feedback Analytics
      </Typography>

      {/* Debug Info */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body2">
          Debug: Loading={loading.toString()}, Data Count={feedbackData.length}, Analytics Keys={Object.keys(analytics).length}
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Time Period</InputLabel>
              <Select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                label="Time Period"
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Rating Filter</InputLabel>
              <Select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                label="Rating Filter"
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={exportFeedback}
                size="small"
              >
                Export CSV
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="📈 Overview" />
        <Tab label="💬 Feedback List" />
        <Tab label="📊 Analytics" />
        <Tab label="📝 Add Feedback" />
      </Tabs>

      <Box>
        {/* Overview Tab */}
        {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h4">{analytics.averageRating}</Typography>
                </Box>
                <Typography color="textSecondary">Average Rating</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(analytics.averageRating / 5) * 100} 
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ThumbUpIcon sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h4">{analytics.positiveFeedback}</Typography>
                </Box>
                <Typography color="textSecondary">Positive Feedback</Typography>
                <Typography variant="body2" color="success.main">
                  {((analytics.positiveFeedback / analytics.totalFeedback) * 100).toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CommentIcon sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="h4">{analytics.totalFeedback}</Typography>
                </Box>
                <Typography color="textSecondary">Total Feedback</Typography>
                <Typography variant="body2" color="info.main">
                  This month: {analytics.monthlyTrend?.[5]?.feedback || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h4">{analytics.responseRate}%</Typography>
                </Box>
                <Typography color="textSecondary">Response Rate</Typography>
                <Typography variant="body2" color="primary.main">
                  Avg: {analytics.averageResponseTime}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Rated Services */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>🏆 Top Rated Services</Typography>
                {analytics.topRatedServices?.map((service, index) => (
                  <Box key={service.name} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {index + 1}. {service.name}
                      </Typography>
                      <Rating value={service.rating} readOnly size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="textSecondary">
                        {service.feedbackCount} feedbacks
                      </Typography>
                      <Typography variant="body2" color="primary.main">
                        {service.rating}/5.0
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(service.rating / 5) * 100} 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Improvement Areas */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>🎯 Improvement Areas</Typography>
                {analytics.improvementAreas?.map((area, index) => (
                  <Box key={area.category} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {area.category}
                      </Typography>
                      <Chip 
                        label={`${area.count} issues`} 
                        size="small" 
                        color="warning"
                      />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={area.percentage} 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Feedback List Tab */}
      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Feedback</TableCell>
                <TableCell>Sentiment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                        {feedback.clientName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {feedback.clientName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {feedback.clientEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{feedback.eventName}</TableCell>
                  <TableCell>
                    <Chip label={feedback.serviceType} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Rating value={feedback.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={feedback.feedback}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 200, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {feedback.feedback}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={feedback.sentiment} 
                      color={getSentimentColor(feedback.sentiment)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{feedback.date}</TableCell>
                  <TableCell>
                    <Chip 
                      label={feedback.resolved ? 'Resolved' : 'Pending'} 
                      color={feedback.resolved ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Analytics Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Monthly Trend Chart */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>📈 Monthly Rating Trend</Typography>
                <Box sx={{ height: 300, p: 2 }}>
                  {analytics.monthlyTrend?.map((month, index) => (
                    <Box key={month.month} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{month.month}</Typography>
                        <Typography variant="body2">{month.rating}/5.0</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(month.rating / 5) * 100} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: month.rating >= 4.5 ? 'success.main' : 
                                             month.rating >= 3.5 ? 'warning.main' : 'error.main'
                          }
                        }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {month.feedback} feedbacks
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sentiment Distribution */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>💭 Sentiment Distribution</Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Positive</Typography>
                    <Typography variant="body2">{analytics.positiveFeedback}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(analytics.positiveFeedback / analytics.totalFeedback) * 100} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 2,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': { backgroundColor: 'success.main' }
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Neutral</Typography>
                    <Typography variant="body2">{analytics.neutralFeedback}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(analytics.neutralFeedback / analytics.totalFeedback) * 100} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 2,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': { backgroundColor: 'warning.main' }
                    }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Negative</Typography>
                    <Typography variant="body2">{analytics.negativeFeedback}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(analytics.negativeFeedback / analytics.totalFeedback) * 100} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 2,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': { backgroundColor: 'error.main' }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Response Metrics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>⚡ Response Metrics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'primary.50', borderRadius: 2 }}>
                      <Typography variant="h4" color="primary.main">{analytics.responseRate}%</Typography>
                      <Typography variant="body2" color="textSecondary">Response Rate</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'info.50', borderRadius: 2 }}>
                      <Typography variant="h4" color="info.main">{analytics.averageResponseTime}</Typography>
                      <Typography variant="body2" color="textSecondary">Avg Response Time</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'success.50', borderRadius: 2 }}>
                      <Typography variant="h4" color="success.main">{analytics.resolvedIssues}</Typography>
                      <Typography variant="body2" color="textSecondary">Resolved Issues</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'warning.50', borderRadius: 2 }}>
                      <Typography variant="h4" color="warning.main">{analytics.pendingIssues}</Typography>
                      <Typography variant="body2" color="textSecondary">Pending Issues</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Rating Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>⭐ Rating Distribution</Typography>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = feedbackData.filter(f => f.rating === rating).length;
                  const percentage = (count / feedbackData.length) * 100;
                  return (
                    <Box key={rating} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={rating} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            ({count})
                          </Typography>
                        </Box>
                        <Typography variant="body2">{percentage.toFixed(1)}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: rating >= 4 ? 'success.main' : 
                                             rating >= 3 ? 'warning.main' : 'error.main'
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Add Feedback Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <Card sx={{ 
                  background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Typography variant="h5" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 3
                      }}>
                        📝 Submit Client Feedback
                      </Typography>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Box component="form" onSubmit={handleSubmitFeedback}>
                        <Grid container spacing={3}>
                          {[
                            { label: 'Client Name', name: 'clientName', type: 'text', required: true, md: 6 },
                            { label: 'Email Address', name: 'clientEmail', type: 'email', required: true, md: 6 },
                            { label: 'Event Name', name: 'eventName', type: 'text', required: true, md: 6, placeholder: 'e.g., Wedding Ceremony, Birthday Party' }
                          ].map((field, index) => (
                            <Grid item xs={12} md={field.md} key={field.name}>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                              >
                                <TextField
                                  fullWidth
                                  label={field.label}
                                  name={field.name}
                                  type={field.type}
                                  value={feedbackForm[field.name]}
                                  onChange={handleFeedbackFormChange}
                                  required={field.required}
                                  variant="outlined"
                                  placeholder={field.placeholder}
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                        borderWidth: 2
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                        borderWidth: 2
                                      }
                                    }
                                  }}
                                />
                              </motion.div>
                            </Grid>
                          ))}
                          
                          <Grid item xs={12} md={6}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.8 }}
                            >
                              <FormControl fullWidth required>
                                <InputLabel>Service Type</InputLabel>
                                <Select
                                  name="serviceType"
                                  value={feedbackForm.serviceType}
                                  onChange={handleFeedbackFormChange}
                                  label="Service Type"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2
                                    }
                                  }}
                                >
                                  <MenuItem value="Photography">📸 Photography</MenuItem>
                                  <MenuItem value="Videography">🎥 Videography</MenuItem>
                                  <MenuItem value="Catering">🍽️ Catering</MenuItem>
                                  <MenuItem value="Decoration">🎨 Decoration</MenuItem>
                                  <MenuItem value="Event Management">📋 Event Management</MenuItem>
                                  <MenuItem value="Music">🎵 Music & DJ</MenuItem>
                                  <MenuItem value="Other">📦 Other</MenuItem>
                                </Select>
                              </FormControl>
                            </motion.div>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.9 }}
                            >
                              <Box sx={{ mb: 3, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                                  ⭐ Rate Your Experience
                                </Typography>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Rating
                                    value={feedbackForm.rating}
                                    onChange={handleRatingChange}
                                    size="large"
                                    sx={{
                                      '& .MuiRating-icon': {
                                        transition: 'all 0.2s ease'
                                      },
                                      '& .MuiRating-iconHover': {
                                        transform: 'scale(1.2)'
                                      }
                                    }}
                                  />
                                </motion.div>
                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                  {feedbackForm.rating === 5 && 'Excellent! We\'re thrilled you had a great experience!'}
                                  {feedbackForm.rating === 4 && 'Great! We appreciate your positive feedback.'}
                                  {feedbackForm.rating === 3 && 'Good! We\'ll work to make it even better next time.'}
                                  {feedbackForm.rating === 2 && 'We\'re sorry to hear that. Your feedback helps us improve.'}
                                  {feedbackForm.rating === 1 && 'We sincerely apologize. We\'ll address your concerns immediately.'}
                                </Typography>
                              </Box>
                            </motion.div>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 1.0 }}
                            >
                              <FormControl fullWidth>
                                <InputLabel>Feedback Category</InputLabel>
                                <Select
                                  name="category"
                                  value={feedbackForm.category}
                                  onChange={handleFeedbackFormChange}
                                  label="Feedback Category"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2
                                    }
                                  }}
                                >
                                  <MenuItem value="service_quality">🎯 Service Quality</MenuItem>
                                  <MenuItem value="timing">⏰ Timing</MenuItem>
                                  <MenuItem value="communication">💬 Communication</MenuItem>
                                  <MenuItem value="coordination">🤝 Coordination</MenuItem>
                                  <MenuItem value="value_for_money">💰 Value for Money</MenuItem>
                                  <MenuItem value="other">📦 Other</MenuItem>
                                </Select>
                              </FormControl>
                            </motion.div>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <motion.div
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 1.1 }}
                            >
                              <TextField
                                fullWidth
                                label="Your Feedback"
                                name="feedback"
                                value={feedbackForm.feedback}
                                onChange={handleFeedbackFormChange}
                                required
                                multiline
                                rows={4}
                                variant="outlined"
                                placeholder="Please share your experience with our service... What did you like? What could we improve?"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                      borderColor: 'primary.main',
                                      borderWidth: 2
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: 'primary.main',
                                      borderWidth: 2
                                    }
                                  }
                                }}
                              />
                            </motion.div>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 1.2 }}
                            >
                              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="outlined"
                                    startIcon={<ClearIcon />}
                                    onClick={() => setFeedbackForm({
                                      clientName: '',
                                      clientEmail: '',
                                      eventName: '',
                                      serviceType: '',
                                      rating: 5,
                                      feedback: '',
                                      category: 'service_quality'
                                    })}
                                    sx={{ 
                                      borderRadius: 2,
                                      px: 3,
                                      py: 1,
                                      '&:hover': {
                                        backgroundColor: 'grey.100'
                                      }
                                    }}
                                  >
                                    Clear Form
                                  </Button>
                                </motion.div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={submitting}
                                    startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                                    sx={{ 
                                      borderRadius: 2,
                                      px: 4,
                                      py: 1,
                                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                      '&:hover': {
                                        background: 'linear-gradient(45deg, #1565c0, #2196f3)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                                      }
                                    }}
                                  >
                                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                                  </Button>
                                </motion.div>
                              </Box>
                            </motion.div>
                          </Grid>
                        </Grid>
                      </Box>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>📋 Quick Stats</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Total Feedback Collected
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {analytics.totalFeedback}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Average Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" color="warning.main" sx={{ mr: 1 }}>
                      {analytics.averageRating?.toFixed(1)}
                    </Typography>
                    <Rating value={analytics.averageRating} readOnly size="small" />
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Response Rate
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {analytics.responseRate}%
                  </Typography>
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Your feedback helps us improve our services and provide better experiences for all clients.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      </Box>
    </Box>
  );
};

export default ClientFeedbackAnalytics;
