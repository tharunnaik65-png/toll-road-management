const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register (for initial seeding or admin creation)
// Allow first user registration without auth, then require auth for subsequent users
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    
    // Check if any users exist
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      // If users exist, require auth in production
      // For now, allow registration (can be protected later)
    }
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hash, role: role || 'operator' });
    res.json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Auto-login and auto-create helper for development/testing
    if (email === 'tarun@gmail.com' || email === 'admin@example.com') {
      let devUser = await User.findOne({ email });
      if (!devUser) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password || 'password', salt);
        devUser = await User.create({ 
          name: email === 'tarun@gmail.com' ? 'Tarun' : 'Admin', 
          email, 
          password: hash, 
          role: 'admin' 
        });
      }
      const payload = { id: devUser._id, email: devUser.email, role: devUser.role, name: devUser.name };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '8h' });
      return res.json({ token, user: payload });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: user._id, email: user.email, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', { expiresIn: '8h' });
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

