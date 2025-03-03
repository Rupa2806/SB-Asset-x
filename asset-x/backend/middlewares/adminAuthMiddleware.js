// backend/middlewares/adminAuthMiddleware.js
exports.verifyAdminToken = (req, res, next) => {
    const token = req.headers['authorization'];
    // For demo: if token equals "admin-token", allow access
    if (token === 'admin-token') {
      // Optionally, set req.user as an admin user
      req.user = { role: 'admin', email: 'admin@gmail.com' };
      return next();
    }
    // Otherwise, send unauthorized response
    return res.status(401).json({ message: 'Failed to authenticate token' });
  };
  