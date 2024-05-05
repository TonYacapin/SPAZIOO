const mongoose = require('mongoose');

const landSchema = new mongoose.Schema({
  landName: { type: String, required: true },
  landSize: { type: String, required: true },
  locationName:  { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: { type: String, required: true },
  imageUrl: { type: String, default: 'https://example.com/image3.jpg' },
  option: { type: String, enum: ['Rent', 'Lease', 'Sale'], required: true },
  isAvailable: { type: Boolean, default: true },
  description: { type: String, required: true },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }],
  isBanned: { type: Boolean, default: false } // Adding isActive field
});

// Index the location field for geospatial queries
landSchema.index({ location: '2dsphere' });

const Land = mongoose.model('Land', landSchema);

module.exports = Land;
