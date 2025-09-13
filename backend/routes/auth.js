const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role, phone, address, farmName } = req.body;
    
    if (!name?.trim() || !email?.trim() || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    console.log('Registration data:', { name, username, email, role, phone, address, farmName });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const userData = { name, email, password, role, phone, address, farmName };
    if (username && username.trim()) {
      userData.username = username.trim();
    }

    const user = new User(userData);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, username: user.username, email, role, phone, farmName, address, profileImage: user.profileImage } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ $or: [{ email }, { username: email }] });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role, phone: user.phone, farmName: user.farmName, address: user.address, profileImage: user.profileImage } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.phone !== undefined) updateFields.phone = req.body.phone;
    if (req.body.farmName !== undefined) updateFields.farmName = req.body.farmName;
    if (req.body.address !== undefined) updateFields.address = req.body.address;
    if (req.body.profileImage !== undefined) updateFields.profileImage = req.body.profileImage;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true }
    );
    
    res.json({ 
      user: { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        role: updatedUser.role, 
        phone: updatedUser.phone, 
        farmName: updatedUser.farmName, 
        address: updatedUser.address, 
        profileImage: updatedUser.profileImage 
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;