const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  land: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Land',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  transactionType: {
    type: String,
    enum: ['Rent', 'Lease', 'Sale'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
