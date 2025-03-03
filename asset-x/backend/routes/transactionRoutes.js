// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/deposite/:id', transactionController.deposit);
router.post('/withdraw/:id', transactionController.withdraw);

module.exports = router;
