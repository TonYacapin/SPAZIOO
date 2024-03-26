const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  landName: { type: String, required: true },
  landSize: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
  option: { type: String, enum: ['Rent', 'Lease', 'Buy'], required: true },
  isAvailable: { type: Boolean, default: true },
  description: { type: String, required: true }, // New field: Land Description
});

const Land = mongoose.model('Land', landSchema);

module.exports = Land;
