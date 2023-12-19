const express = require('express');
const Admin = require('../services/servicesAdmin');
const route = express.Router();

const adminService = new Admin();


route.get('/', async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.get('/:adminId', async (req, res) => {
  const adminId = req.params.adminId;
  try {
    const admin = await adminService.getAdminById(adminId);
    if (!admin) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.json(admin);
    }
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.post('/', async (req, res) => {
  const newAdmin = req.body;
  try {
    const createdAdmin = await adminService.createAdmin(newAdmin);
    res.status(201).json(createdAdmin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.put('/:adminId', async (req, res) => {
  const adminId = req.params.adminId;
  const updatedAdmin = req.body;
  try {
    const updatedAdminResult = await adminService.updateAdmin(adminId, updatedAdmin);
    if (!updatedAdminResult) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.json(updatedAdminResult);
    }
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

route.delete('/:adminId', async (req, res) => {
  const adminId = req.params.adminId;
  try {
    const deletedAdmin = await adminService.deleteAdmin(adminId);
    if (!deletedAdmin) {
      res.status(404).json({ error: 'Admin not found' });
    } else {
      res.json(deletedAdmin);
    }
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = route;