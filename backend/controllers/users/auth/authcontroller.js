const mongoose = require('mongoose');
const User = require("../../../models/users/auth/usersModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT Token Generator
const generateToken = (userId, userEmail) => {
  return jwt.sign(
    { id: userId, email: userEmail },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }  // Extend to 7 days
  );
};


// ✅ Signup
const signup = async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  const phone = req.body.phone?.trim();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      token: generateToken(newUser._id, newUser.email),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id, user.email),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// Get User by ID
const getUserById = async (req, res) => {
  const { userId } = req.params;  // Grab the userId from the URL params
  console.log("Received userId:", userId);  // Debugging line to check what userId we are receiving

  // Check if the provided userId is a valid ObjectId
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    console.error("Invalid user ID format or missing ID");  // Debugging error log
    return res.status(400).json({ success: false, message: 'Invalid or missing user ID' });
  }

  try {
    // Query to find user by _id
    const user = await User.findById(userId).exec();

    // If the user doesn't exist, return a 404 error
    if (!user) {
      console.error("User not found with ID:", userId);  // Debugging line to log when user is not found
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return the user if found
    console.log("User found:", user);  // Debugging line to log the found user
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    // Log any unexpected errors for debugging
    console.error("Error fetching user:", error);  // More detailed error log
    res.status(500).json({ success: false, message: 'Failed to retrieve user' });
  }
};




// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords from response
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully", data: user });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

module.exports = { signup, login, getUsers, deleteUser, getUserById, updateUser };
