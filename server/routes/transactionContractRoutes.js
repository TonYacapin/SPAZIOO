const express = require('express');
const router = express.Router();
const transactionContractController = require('../Controllers/transactioncontractControllers');

router.post('/', transactionContractController.createTransactionContract);
router.get('/', transactionContractController.getAllTransactionContracts);
router.get('/:id', transactionContractController.getTransactionContractById);
router.put('/:id', transactionContractController.updateTransactionContractById);
router.delete('/:id', transactionContractController.deleteTransactionContractById);
router.get('/getContractsForUser/:userId', transactionContractController.getContractsForUser);
router.get('/getContractsForLand/:landId', transactionContractController.getContractsForLand); // New route for fetching contracts for a specific land

module.exports = router;
