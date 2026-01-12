// frontend/src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button,
  IconButton, Tooltip, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel,
  Select, MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as AddIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching all users...');
      
      // Get all users from database (unprotected endpoint)
      const response = await api.get('/public-users');
      console.log('Users response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      if (response.data && response.data.success) {
        setUsers(response.data.data);
        console.log('✅ Users loaded from API:', response.data.data.length);
      } else {
        console.log('❌ API response not successful, using fallback data');
        // Fallback: Get users from existing data
        const mockUsers = [
          { _id: '1', name: 'Jeet', email: 'jeet@gmail.com', role: 'user', department: 'General', createdAt: new Date() },
          { _id: '2', name: 'Anuj', email: 'om@gamil.com', role: 'staff', department: 'Operations', createdAt: new Date() },
          { _id: '3', name: 'ram', email: 'ram@gmail.com', role: 'user', department: 'General', createdAt: new Date() },
          { _id: '4', name: 'Test User', email: 'test@example.com', role: 'user', department: 'General', createdAt: new Date() },
          { _id: '5', name: 'Staff Member', email: 'staff@gmail.com', role: 'staff', department: 'Operations', createdAt: new Date() },
          { _id: '6', name: 'sejal', email: 'sejal@gmail.com', role: 'admin', department: 'Administration', createdAt: new Date() }
        ];
        setUsers(mockUsers);
        console.log('Using fallback users data');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      toast.error('Failed to fetch users: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'staff': return 'warning';
      case 'user': return 'success';
      default: return 'default';
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      toast.info('Delete user functionality coming soon');
    }
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">All Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => toast.info('Add user functionality coming soon')}
        >
          Add User
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.department || 'General'}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit User">
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user._id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={selectedUser?.name || ''}
            onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            variant="outlined"
            value={selectedUser?.email || ''}
            onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedUser?.role || 'user'}
              onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={() => {
            toast.info('Update user functionality coming soon');
            handleCloseDialog();
          }} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
