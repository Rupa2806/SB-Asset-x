// backend/controllers/adminController.js
const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// backend/controllers/adminController.js
exports.getDashboardData = async (req, res) => {
    try {
      const users = await User.find();
      const accounts = await Account.find().populate('user');
      const transactions = await Transaction.find();
      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      
      res.status(200).json({
        users,
        accounts,
        transactions,
        totalBalance,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

exports.addAmount = async (req, res) => {
  const { amount } = req.body;
  const accountId = req.params.accountId;
  try {
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    account.balance += parseFloat(amount);
    await account.save();
    res.status(200).json({ message: 'Amount added', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.subtractAmount = async (req, res) => {
  const { amount } = req.body;
  const accountId = req.params.accountId;
  try {
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    account.balance -= parseFloat(amount);
    await account.save();
    res.status(200).json({ message: 'Amount subtracted', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
