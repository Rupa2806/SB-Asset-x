// backend/routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const { createAccount, deposit, withdraw, transfer, getBalance } = require('../controllers/accountController');
const { verifyToken } = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');

// Create a new account for a user
router.post('/create', verifyToken, createAccount);

// Deposit money into an account
router.post('/deposit/:id', verifyToken, deposit);

// Withdraw money from an account
router.post('/withdraw/:id', verifyToken, withdraw);

// Transfer money from one account to another
router.post('/transfer', verifyToken, transfer);

// Get the balance and account details by account ID
router.get('/balance/:id', verifyToken, getBalance);

// NEW: Get account details by userId
router.get('/user/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const Account = require('../models/Account'); // Import the Account model
    // Use "new" to create an ObjectId from the string
    const account = await Account.findOne({ user: new mongoose.Types.ObjectId(userId) });
    if (account) {
      res.status(200).json({
        accountNumber: account.accountNumber,
        balance: account.balance,
        accountId: account._id
      });
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (error) {
    console.error('Error fetching account by userId:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
