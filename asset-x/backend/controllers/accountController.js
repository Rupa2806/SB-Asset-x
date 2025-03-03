// backend/controllers/accountController.js
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// Utility: generate a 10-digit numeric account number
const generateAccountNumber = () => {
  let accountNumber = '';
  while (accountNumber.length < 10) {
    accountNumber += Math.floor(Math.random() * 10);
  }
  return accountNumber;
};

exports.createAccount = async (req, res) => {
  const { userId } = req.body;
  try {
    let account = await Account.findOne({ user: userId });
    if (account) return res.status(400).json({ message: 'Account already exists' });

    const accountNumber = generateAccountNumber();
    account = new Account({ user: userId, accountNumber });
    await account.save();
    res.status(201).json({ message: 'Account created', account });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deposit = async (req, res) => {
  const accountId = req.params.id;
  const { amount } = req.body;
  try {
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    account.balance += parseFloat(amount);
    await account.save();
    const transaction = new Transaction({ account: accountId, type: 'deposit', amount });
    await transaction.save();
    res.status(200).json({ message: 'Deposit successful', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.withdraw = async (req, res) => {
  const accountId = req.params.id;
  const { amount } = req.body;
  try {
    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    if (account.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    account.balance -= parseFloat(amount);
    await account.save();
    const transaction = new Transaction({ account: accountId, type: 'withdraw', amount });
    await transaction.save();
    res.status(200).json({ message: 'Withdrawal successful', balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.transfer = async (req, res) => {
  const { fromAccountId, toAccountNumber, amount } = req.body;
  try {
    const fromAccount = await Account.findById(fromAccountId);
    if (!fromAccount) return res.status(404).json({ message: 'Sender account not found' });
    if (fromAccount.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    
    const toAccount = await Account.findOne({ accountNumber: toAccountNumber });
    if (!toAccount) return res.status(404).json({ message: 'Recipient account not found' });
    
    fromAccount.balance -= parseFloat(amount);
    toAccount.balance += parseFloat(amount);
    await fromAccount.save();
    await toAccount.save();
    
    const transaction = new Transaction({ account: fromAccountId, type: 'transfer', amount, recipientAccount: toAccountNumber });
    await transaction.save();
    res.status(200).json({ message: 'Transfer successful', balance: fromAccount.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBalance = async (req, res) => {
    const accountId = req.params.id;
    try {
      const account = await Account.findById(accountId);
      if (!account) return res.status(404).json({ message: 'Account not found' });
      res.status(200).json({ 
        balance: account.balance, 
        accountNumber: account.accountNumber, 
        accountId: account._id 
      });
    } catch (error) {
      console.error('Error in getBalance:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
