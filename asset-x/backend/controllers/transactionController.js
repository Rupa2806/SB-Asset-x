// controllers/transactionController.js
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.deposit = async (req, res) => {
    const accountId = req.params.id;
    const { amount } = req.body;
    try {
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        account.balance += parseFloat(amount);
        await account.save();

        // Log deposit transaction
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
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        if (account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }
        account.balance -= parseFloat(amount);
        await account.save();

        // Log withdrawal transaction
        const transaction = new Transaction({ account: accountId, type: 'withdraw', amount });
        await transaction.save();
        res.status(200).json({ message: 'Withdrawal successful', balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
