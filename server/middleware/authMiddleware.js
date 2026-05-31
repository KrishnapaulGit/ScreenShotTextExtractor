const jwt = require('jsonwebtoken');

/**
 * Middleware to verify Bearer token in Authorization header
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No authorization header provided'
    });
  }

  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authorization header format. Use: Bearer <token>'
    });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'Your token has expired. Please generate a new one.'
      });
    }
    
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'Token is invalid or malformed'
    });
  }
};

/**
 * Optional middleware for logging authenticated requests
 */
const logAuthRequest = (req, res, next) => {
  if (req.user) {
    console.log(`[AUTH] User: ${req.user.userId} | IP: ${req.ip} | Path: ${req.path}`);
  }
  next();
};

module.exports = {
  verifyToken,
  logAuthRequest
};
