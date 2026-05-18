const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plate: { type: String, required: true, unique: true },
  type: { type: String, enum: ['car', 'bike', 'truck', 'bus'], default: 'car' },
  owner: { type: String },
  fastagId: { type: String, default: null },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
