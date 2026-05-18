const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { authenticate, authorize } = require('../middleware/auth');

// Create vehicle
router.post('/', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const { plate, type, owner, fastagId, notes } = req.body;
    const exist = await Vehicle.findOne({ plate });
    if (exist) return res.status(400).json({ message: 'Vehicle already exists' });
    const v = await Vehicle.create({ plate, type, owner, fastagId, notes });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get list (with search)
router.get('/', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { plate: { $regex: q, $options: 'i' } } : {};
    const list = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single
router.get('/:id', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const v = await Vehicle.findById(req.params.id);
    if (!v) return res.status(404).json({ message: 'Not found' });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update
router.put('/:id', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
