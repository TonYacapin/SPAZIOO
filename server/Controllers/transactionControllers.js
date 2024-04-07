const Transaction = require('../models/TransactionModel');

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { land, buyer, transactionDate, transactionType, amount, isCompleted } = req.body;
    
    const newTransaction = new Transaction({
      land,
      buyer,
      transactionDate,
      transactionType,
      amount,
      isCompleted
    });

    const savedTransaction = await newTransaction.save();

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a transaction by ID
const updateTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { land, buyer, transactionDate, transactionType, amount, isCompleted } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { land, buyer, transactionDate, transactionType, amount, isCompleted, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a transaction by ID
const deleteTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transactions by IDs
// Get transactions by IDs
const getTransactionsByIds = async (req, res) => {
  try {
    const { transactionIds } = req.query;
    
    console.log('Received transactionIds:', transactionIds);

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty transactionIds provided' });
    }

    const transactions = await Transaction.find({ _id: { $in: transactionIds } });

    console.log('Fetched transactions:', transactions);

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error in getTransactionsByIds:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  getTransactionsByIds,
};
