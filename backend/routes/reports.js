const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { authenticate, authorize } = require('../middleware/auth');

// Daily revenue
router.get('/daily', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const list = await Transaction.aggregate([
      { $match: { status: 'closed', exitTime: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    res.json(list[0] || { total: 0, count: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Monthly revenue (by month)
router.get('/monthly', authenticate, authorize(['admin','operator']), async (req, res) => {
  try {
    const year = parseInt(req.query.year || new Date().getFullYear());
    const list = await Transaction.aggregate([
      { $match: { status: 'closed', exitTime: { $gte: new Date(`${year}-01-01`) } } },
      { $group: { _id: { $month: '$exitTime' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id': 1 } }
    ]);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
