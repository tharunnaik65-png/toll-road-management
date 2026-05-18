const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  plate: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  amount: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['cash', 'fastag', 'rfid'], default: 'cash' },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  receiptId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
