// frontend/src/components/service/ServicePackageManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, Chip, Switch, FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  getServices,
  createService,
  updateService,
  deleteService,
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
} from '../../services/servicePackageService';

const ServicePackageManagement = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 for services, 1 for packages
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Service dialog state
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState({
    name: '',
    description: '',
    type: '',
    basePrice: ''
  });
  const [isEditingService, setIsEditingService] = useState(false);
  
  // Package dialog state
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({
    name: '',
    description: '',
    includedServices: [],
    duration: '',
    price: ''
  });
  const [isEditingPackage, setIsEditingPackage] = useState(false);

  const serviceTypes = ['Photography', 'Videography', 'Decoration', 'Catering', 'Music', 'Lighting'];

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Fetch packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await getPackages();
      if (response.success) {
        setPackages(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchServices();
    } else {
      fetchPackages();
    }
  }, [activeTab]);

  // Service handlers
  const handleOpenServiceDialog = (service = null) => {
    if (service) {
      setCurrentService({
        name: service.name,
        description: service.description,
        type: service.type,
        basePrice: service.basePrice
      });
      setIsEditingService(true);
    } else {
      setCurrentService({
        name: '',
        description: '',
        type: '',
        basePrice: ''
      });
      setIsEditingService(false);
    }
    setServiceDialogOpen(true);
  };

  const handleCloseServiceDialog = () => {
    setServiceDialogOpen(false);
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (isEditingService) {
        await updateService(currentService._id, currentService);
        toast.success('Service updated successfully');
      } else {
        await createService(currentService);
        toast.success('Service created successfully');
      }
      await fetchServices();
      handleCloseServiceDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        toast.success('Service deleted successfully');
        await fetchServices();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  // Package handlers
  const handleOpenPackageDialog = (pkg = null) => {
    if (pkg) {
      setCurrentPackage({
        name: pkg.name,
        description: pkg.description,
        includedServices: pkg.includedServices.map(s => s._id),
        duration: pkg.duration,
        price: pkg.price
      });
      setIsEditingPackage(true);
    } else {
      setCurrentPackage({
        name: '',
        description: '',
        includedServices: [],
        duration: '',
        price: ''
      });
      setIsEditingPackage(false);
    }
    setPackageDialogOpen(true);
  };

  const handleClosePackageDialog = () => {
    setPackageDialogOpen(false);
  };

  const handlePackageInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      if (isEditingPackage) {
        await updatePackage(currentPackage._id, currentPackage);
        toast.success('Package updated successfully');
      } else {
        await createPackage(currentPackage);
        toast.success('Package created successfully');
      }
      await fetchPackages();
      handleClosePackageDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save package');
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        toast.success('Package deleted successfully');
        await fetchPackages();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete package');
      }
    }
  };

  if (loading && services.length === 0 && packages.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Service & Package Management
      </Typography>

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Button
          onClick={() => setActiveTab(0)}
          variant={activeTab === 0 ? 'contained' : 'text'}
          sx={{ mr: 2 }}
        >
          Services
        </Button>
        <Button
          onClick={() => setActiveTab(1)}
          variant={activeTab === 1 ? 'contained' : 'text'}
        >
          Packages
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Services Tab */}
      {activeTab === 0 && (
        <Paper sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Services</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenServiceDialog()}
            >
              Add Service
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Base Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>
                      <Chip label={service.type} color="primary" size="small" />
                    </TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>₹{service.basePrice}</TableCell>
                    <TableCell>
                      <Switch
                        checked={service.isActive}
                        disabled
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenServiceDialog(service)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteService(service._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Packages Tab */}
      {activeTab === 1 && (
        <Paper sx={{ mt: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Packages</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenPackageDialog()}
            >
              Add Package
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg._id}>
                    <TableCell>{pkg.name}</TableCell>
                    <TableCell>{pkg.description}</TableCell>
                    <TableCell>
                      {pkg.includedServices.map(service => (
                        <Chip 
                          key={service._id} 
                          label={service.name} 
                          color="secondary" 
                          size="small" 
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>{pkg.duration} hours</TableCell>
                    <TableCell>₹{pkg.price}</TableCell>
                    <TableCell>
                      <Switch
                        checked={pkg.isActive}
                        disabled
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenPackageDialog(pkg)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeletePackage(pkg._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Service Dialog */}
      <Dialog open={serviceDialogOpen} onClose={handleCloseServiceDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveService}>
          <DialogTitle>
            {isEditingService ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Service Name"
                value={currentService.name}
                onChange={handleServiceInputChange}
                required
              />
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Service Type</InputLabel>
                <Select
                  name="type"
                  value={currentService.type}
                  onChange={handleServiceInputChange}
                  label="Service Type"
                  required
                >
                  {serviceTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                name="description"
                label="Description"
                value={currentService.description}
                onChange={handleServiceInputChange}
                multiline
                rows={3}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                name="basePrice"
                label="Base Price (₹)"
                type="number"
                value={currentService.basePrice}
                onChange={handleServiceInputChange}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseServiceDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditingService ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Package Dialog */}
      <Dialog open={packageDialogOpen} onClose={handleClosePackageDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSavePackage}>
          <DialogTitle>
            {isEditingPackage ? 'Edit Package' : 'Add New Package'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                margin="normal"
                name="name"
                label="Package Name"
                value={currentPackage.name}
                onChange={handlePackageInputChange}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                name="description"
                label="Description"
                value={currentPackage.description}
                onChange={handlePackageInputChange}
                multiline
                rows={3}
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Services</InputLabel>
                <Select
                  multiple
                  name="includedServices"
                  value={currentPackage.includedServices}
                  onChange={handlePackageInputChange}
                  label="Included Services"
                  required
                >
                  {services.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                name="duration"
                label="Duration (hours)"
                type="number"
                value={currentPackage.duration}
                onChange={handlePackageInputChange}
                required
              />

              <TextField
                fullWidth
                margin="normal"
                name="price"
                label="Package Price (₹)"
                type="number"
                value={currentPackage.price}
                onChange={handlePackageInputChange}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePackageDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {isEditingPackage ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ServicePackageManagement;
