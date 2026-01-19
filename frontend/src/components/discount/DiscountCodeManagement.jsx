import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, Chip, Grid, Card, CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as DiscountIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const DiscountCodeManagement = () => {
  const [discountCodes, setDiscountCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    isActive: true,
    applicableTo: 'all' // 'all', 'services', 'packages'
  });

  // Mock discount codes
  const mockDiscountCodes = [
    {
      id: 1,
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minAmount: 5000,
      maxDiscount: 2000,
      usageLimit: 100,
      usedCount: 25,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true,
      applicableTo: 'all'
    },
    {
      id: 2,
      code: 'SUMMER20',
      type: 'percentage',
      value: 20,
      minAmount: 10000,
      maxDiscount: 5000,
      usageLimit: 50,
      usedCount: 12,
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      isActive: true,
      applicableTo: 'packages'
    },
    {
      id: 3,
      code: 'FLAT500',
      type: 'fixed',
      value: 500,
      minAmount: 3000,
      maxDiscount: null,
      usageLimit: 200,
      usedCount: 45,
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      isActive: false,
      applicableTo: 'services'
    }
  ];

  useEffect(() => {
    setDiscountCodes(mockDiscountCodes);
    setLoading(false);
  }, []);

  const handleOpenDialog = (code = null) => {
    if (code) {
      setEditingCode(code);
      setFormData({
        code: code.code,
        type: code.type,
        value: code.value,
        minAmount: code.minAmount || '',
        maxDiscount: code.maxDiscount || '',
        usageLimit: code.usageLimit || '',
        startDate: code.startDate,
        endDate: code.endDate,
        isActive: code.isActive,
        applicableTo: code.applicableTo
      });
    } else {
      setEditingCode(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minAmount: '',
        maxDiscount: '',
        usageLimit: '',
        startDate: '',
        endDate: '',
        isActive: true,
        applicableTo: 'all'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCode(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minAmount: '',
      maxDiscount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      isActive: true,
      applicableTo: 'all'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const discountData = {
      ...formData,
      value: parseFloat(formData.value),
      minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      usedCount: editingCode ? editingCode.usedCount : 0
    };

    if (editingCode) {
      setDiscountCodes(codes =>
        codes.map(code =>
          code.id === editingCode.id ? { ...code, ...discountData } : code
        )
      );
      toast.success('Discount code updated successfully!');
    } else {
      const newCode = {
        id: Date.now(),
        ...discountData
      };
      setDiscountCodes([...discountCodes, newCode]);
      toast.success('Discount code created successfully!');
    }

    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      setDiscountCodes(codes => codes.filter(code => code.id !== id));
      toast.success('Discount code deleted successfully!');
    }
  };

  const toggleStatus = (id) => {
    setDiscountCodes(codes =>
      codes.map(code =>
        code.id === id ? { ...code, isActive: !code.isActive } : code
      )
    );
    toast.success('Discount code status updated!');
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  const getTypeColor = (type) => {
    return type === 'percentage' ? 'primary' : 'secondary';
  };

  const getApplicableToColor = (applicableTo) => {
    switch (applicableTo) {
      case 'services': return 'info';
      case 'packages': return 'warning';
      default: return 'default';
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
        <DiscountIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Discount Code Management
      </Typography>

      {/* Create Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Create Discount Code
        </Button>
      </Box>

      {/* Discount Codes Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Min Amount</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Valid Period</TableCell>
              <TableCell>Applicable To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discountCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {code.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={code.type === 'percentage' ? `${code.value}%` : `₹${code.value}`}
                    color={getTypeColor(code.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>₹{code.value.toLocaleString()}</TableCell>
                <TableCell>
                  {code.minAmount ? `₹${code.minAmount.toLocaleString()}` : 'No minimum'}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {code.usedCount} / {code.usageLimit || 'Unlimited'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(code.startDate).toLocaleDateString()} - {new Date(code.endDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={code.applicableTo.charAt(0).toUpperCase() + code.applicableTo.slice(1)}
                    color={getApplicableToColor(code.applicableTo)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={code.isActive ? 'Active' : 'Inactive'}
                    color={getStatusColor(code.isActive)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(code)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => toggleStatus(code.id)}
                      color={code.isActive ? 'warning' : 'success'}
                    >
                      {code.isActive ? '⏸️' : '▶️'}
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(code.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCode ? 'Edit Discount Code' : 'Create Discount Code'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Discount Code"
                  name="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., WELCOME10"
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <MenuItem value="percentage">Percentage (%)</MenuItem>
                    <MenuItem value="fixed">Fixed Amount (₹)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={formData.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                  name="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === 'percentage' ? 'e.g., 10' : 'e.g., 500'}
                  required
                  inputProps={{ min: 0, max: formData.type === 'percentage' ? 100 : null }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Amount (₹)"
                  name="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                  placeholder="e.g., 5000"
                  inputProps={{ min: 0 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Maximum Discount (₹)"
                  name="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="e.g., 2000"
                  inputProps={{ min: 0 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Usage Limit"
                  name="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  placeholder="e.g., 100"
                  inputProps={{ min: 1 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Applicable To</InputLabel>
                  <Select
                    value={formData.applicableTo}
                    onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
                  >
                    <MenuItem value="all">All Services & Packages</MenuItem>
                    <MenuItem value="services">Services Only</MenuItem>
                    <MenuItem value="packages">Packages Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingCode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default DiscountCodeManagement;
