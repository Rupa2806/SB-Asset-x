// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardData, addAmount, subtractAmount, deleteUser } = require('../controllers/adminController');
const { verifyAdminToken } = require('../middlewares/adminAuthMiddleware');

router.get('/dashboard', verifyAdminToken, getDashboardData);
router.put('/account/add/:accountId', verifyAdminToken, addAmount);
router.put('/account/subtract/:accountId', verifyAdminToken, subtractAmount);
router.delete('/user/:userId', verifyAdminToken, deleteUser);

module.exports = router;
