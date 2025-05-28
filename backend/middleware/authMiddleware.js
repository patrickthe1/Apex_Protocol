const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  }
  // User is not authenticated
  res.status(401).json({ msg: 'Unauthorized. Please log in to access this resource.' });
};


const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.is_admin === true) {
    return next(); // User is authenticated and is an admin
  }
  // User is not an admin or not authenticated
  res.status(403).json({ msg: 'Forbidden. Admin access required.' });
};

module.exports = { ensureAuthenticated, ensureAdmin };