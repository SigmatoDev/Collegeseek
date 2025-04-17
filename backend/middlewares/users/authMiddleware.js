const jwt = require('jsonwebtoken');
const User = require('../../models/users/auth/usersModel'); // Assuming you have this model

const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
    req.user = await User.findById(decoded.id);  // Fetch user using the decoded ID from the token
    if (!req.user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    next();  // If user exists, proceed to the next middleware/handler
  } catch (err) {
    console.error("Authentication Error:", err);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateUser;
