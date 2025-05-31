// JWT Utility Functions
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'apex-protocol-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with id, email, etc.
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.username,
    membershipStatus: user.membership_status,
    isAdmin: user.is_admin
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'apex-protocol',
    audience: 'apex-protocol-users'
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'apex-protocol',
      audience: 'apex-protocol-users'
    });
  } catch (error) {
    console.log('🔍 JWT Verification Error:', error.message);
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param {Object} req - Express request object
 * @returns {string|null} Token or null if not found
 */
const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
  
  return null;
};

/**
 * Middleware to authenticate JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  const token = extractTokenFromHeader(req);
  
  console.log('🔍 JWT Auth - Token present:', !!token);
  console.log('🔍 JWT Auth - Auth header:', req.headers.authorization);
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }

  // Add user info to request object
  req.user = {
    id: decoded.userId,
    email: decoded.email,
    membershipStatus: decoded.membershipStatus,
    isAdmin: decoded.isAdmin
  };

  console.log('✅ JWT Auth - User authenticated:', req.user.email);
  next();
};

/**
 * Middleware to check if user is authenticated (optional auth)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  const token = extractTokenFromHeader(req);
  
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        membershipStatus: decoded.membershipStatus,
        isAdmin: decoded.isAdmin
      };
      console.log('✅ JWT Optional Auth - User found:', req.user.email);
    } else {
      console.log('⚠️ JWT Optional Auth - Invalid token, continuing as guest');
    }
  } else {
    console.log('🔍 JWT Optional Auth - No token, continuing as guest');
  }
  
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  authenticateToken,
  optionalAuth
};
