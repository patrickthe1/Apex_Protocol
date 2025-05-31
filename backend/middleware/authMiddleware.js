const { authenticateToken } = require('../utils/jwt');

const ensureAuthenticated = authenticateToken;

const ensureAdmin = (req, res, next) => {
  // First authenticate the token
  authenticateToken(req, res, (err) => {
    if (err) return; // Error already handled by authenticateToken

    // Check if user is admin
    if (req.user && req.user.isAdmin === true) {
      return next(); // User is authenticated and is an admin
    }
    
    // User is not an admin
    res.status(403).json({ msg: 'Forbidden. Admin access required.' });
  });
};

module.exports = { ensureAuthenticated, ensureAdmin };