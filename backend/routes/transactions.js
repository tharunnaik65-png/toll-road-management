const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const Vehicle = require('../models/Vehicle');
const Transaction = require('../models/Transaction');
const { authenticate, authorize } = require('../middleware/auth');

function calculateFee(type) {
  // simple fee table
  const map = { bike: 20, car: 50, truck: 120, bus: 100 };
  return map[type] || 50;
}

// Create entry (vehicle passes entry)
router.post('/entry', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const { plate } = req.body;
    if (!plate) return res.status(400).json({ message: 'Plate required' });
    let vehicle = await Vehicle.findOne({ plate });
    if (!vehicle) vehicle = await Vehicle.create({ plate, type: 'car' });
    const trx = await Transaction.create({ vehicle: vehicle._id, plate: vehicle.plate, entryTime: new Date(), status: 'open', receiptId: shortid.generate() });
    res.json(trx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close exit and process payment
router.post('/exit/:id', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const trx = await Transaction.findById(req.params.id).populate('vehicle');
    if (!trx) return res.status(404).json({ message: 'Transaction not found' });
    if (trx.status === 'closed') return res.status(400).json({ message: 'Already closed' });
    const vehicle = trx.vehicle;
    const amount = calculateFee(vehicle?.type || 'car');
    // simulate FASTag if vehicle has fastagId
    let paymentMethod = 'cash';
    if (vehicle && vehicle.fastagId) paymentMethod = 'fastag';
    trx.exitTime = new Date();
    trx.amount = amount;
    trx.paymentMethod = paymentMethod;
    trx.status = 'closed';
    await trx.save();
    res.json(trx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List transactions
router.get('/', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { plate: { $regex: q, $options: 'i' } } : {};
    const list = await Transaction.find(filter).populate('vehicle').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
