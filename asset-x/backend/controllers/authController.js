// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { userId, name, phone, email, age, password } = req.body;
  try {
    let user = await User.findOne({ userId });
    if (user) return res.status(400).json({ message: 'User already exists' });
    if (age < 18) return res.status(400).json({ message: 'User must be 18 or above' });

    user = new User({ userId, name, phone, email, age, password });
    await user.save();

    const payload = { userId: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (password !== user.password)
      return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id, role: user.role, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
