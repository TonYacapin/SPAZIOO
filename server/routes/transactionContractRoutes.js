const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactioncontractControllers');

router.post('/', transactionController.createTransactionContract);
router.get('/', transactionController.getAllTransactionContracts);
router.get('/:id', transactionController.getTransactionContractById);
router.put('/:id', transactionController.updateTransactionContractById);
router.delete('/:id', transactionController.deleteTransactionContractById);


module.exports = router;
