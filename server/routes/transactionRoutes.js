const express = require('express');
const router = express.Router();
const transactionController = require('../Controllers/transactionControllers');

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransactionById);
router.delete('/:id', transactionController.deleteTransactionById);
router.get('/getTransactionsForUser/:userId', transactionController.getTransactionsForUser);

module.exports = router;
