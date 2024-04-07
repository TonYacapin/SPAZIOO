const TransactionContract = require('../models/TransactionContractModel');

// Create a new transaction contract
const createTransactionContract = async (req, res) => {
  try {
    const { transaction, land, contractText, signingParties, signatures } = req.body;
    
    const newTransactionContract = new TransactionContract({
      transaction,
      land,
      contractText,
      signingParties,
      signatures
    });

    const savedTransactionContract = await newTransactionContract.save();

    res.status(201).json(savedTransactionContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all transaction contracts
const getAllTransactionContracts = async (req, res) => {
  try {
    const transactionContracts = await TransactionContract.find();
    res.status(200).json(transactionContracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single transaction contract by ID
const getTransactionContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const transactionContract = await TransactionContract.findById(id);
    
    if (!transactionContract) {
      return res.status(404).json({ message: 'Transaction contract not found' });
    }
    
    res.status(200).json(transactionContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a transaction contract by ID
const updateTransactionContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const { transaction, land, contractText, signingParties, signatures } = req.body;

    const updatedTransactionContract = await TransactionContract.findByIdAndUpdate(
      id,
      { transaction, land, contractText, signingParties, signatures, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTransactionContract) {
      return res.status(404).json({ message: 'Transaction contract not found' });
    }

    res.status(200).json(updatedTransactionContract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a transaction contract by ID
const deleteTransactionContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransactionContract = await TransactionContract.findByIdAndDelete(id);
    
    if (!deletedTransactionContract) {
      return res.status(404).json({ message: 'Transaction contract not found' });
    }

    res.status(200).json({ message: 'Transaction contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transaction contracts for a specific user
const getContractsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const contracts = await TransactionContract.find({ signingParties: userId });
    
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transaction contracts for a specific land
const getContractsForLand = async (req, res) => {
  try {
    const { landId } = req.params;
    const contracts = await TransactionContract.find({ land: landId });
    
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransactionContract,
  getAllTransactionContracts,
  getTransactionContractById,
  updateTransactionContractById,
  deleteTransactionContractById,
  getContractsForUser,
  getContractsForLand,
};
