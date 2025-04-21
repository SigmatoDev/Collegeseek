const jwt = require('jsonwebtoken');
const User = require('../../models/users/auth/usersModel');
require('dotenv').config(); // Ensure environment variables are loaded

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed.' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Received token:", token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided.' });
    }

    // Check if JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables.');
      return res.status(500).json({ message: 'Internal server error.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Find user by ID from decoded token
    const user = await User.findById(decoded.id).select('-password'); // optionally exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user; // attach user to request
    next(); // move to the next middleware

  } catch (err) {
    console.error('Authentication Error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    } else {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

module.exports = authenticateUser;
