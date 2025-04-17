const { response } = require('express');
const PrivacyPolicy = require('../../models/admin/privacyPolicyModel'); // Adjust to match your file path
const mongoose = require('mongoose');
const slugify = require('slugify'); // Ensure slugify is required

// Create a new Privacy Policy entry
const createPrivacyPolicy = async (req, res) => {
  const { title, content } = req.body;

  try {
    // Generate the slug using the title
    const newPrivacyPolicy = new PrivacyPolicy({
      title,
      content,
      slug: slugify(title, { lower: true, strict: true }), // Ensure slug is created here
    });

    await newPrivacyPolicy.save();
    res.status(201).json({
      message: 'Privacy Policy created successfully',
      privacyPolicy: newPrivacyPolicy,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating privacy policy', error: error.message });
  }
};

// Get all Privacy Policies entries
const getPrivacyPolicies = async (req, res) => {
  try {
    // Fetch the privacy policies from the database
    const privacyPolicies = await PrivacyPolicy.find();
    
    // Log the fetched data
    console.log('Fetched Privacy Policies:', privacyPolicies);

    // Send the response with the fetched privacy policies
    res.status(200).json(privacyPolicies);
  } catch (error) {
    // Log the error if fetching fails
    console.error('Error fetching privacy policies:', error.message);

    // Send an error response
    res.status(500).json({ message: 'Error fetching privacy policies', error: error.message });
  }
};


// Get a specific Privacy Policy entry by slug
const getPrivacyPolicyBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const privacyPolicy = await PrivacyPolicy.findOne({ slug });
    if (!privacyPolicy) {
      return res.status(404).json({ message: 'Privacy Policy not found' });
    }
    res.status(200).json(privacyPolicy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching privacy policy', error: error.message });
  }
};

// Update a specific Privacy Policy entry by ID
const updatePrivacyPolicy = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedPrivacyPolicy = await PrivacyPolicy.findByIdAndUpdate(
      id,
      { title, content, slug: slugify(title, { lower: true, strict: true }), updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedPrivacyPolicy) {
      return res.status(404).json({ message: 'Privacy Policy not found' });
    }

    res.status(200).json({
      message: 'Privacy Policy updated successfully',
      privacyPolicy: updatedPrivacyPolicy,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating privacy policy', error: error.message });
  }
};

// Delete a specific Privacy Policy entry by ID
const deletePrivacyPolicy = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPrivacyPolicy = await PrivacyPolicy.findByIdAndDelete(id);

    if (!deletedPrivacyPolicy) {
      return res.status(404).json({ message: 'Privacy Policy not found' });
    }

    res.status(200).json({ message: 'Privacy Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting privacy policy', error: error.message });
  }
};

// Get a Privacy Policy entry by ID
const getPrivacyPolicyById = async (req, res) => {
  try {
    const privacyPolicyId = req.params.id;  // This should capture the privacy policy ID from the URL
    if (!privacyPolicyId) {
      return res.status(400).json({ message: 'No privacy policy ID provided' });
    }

    const privacyPolicy = await PrivacyPolicy.findById(privacyPolicyId);  // This line may be causing the issue

    if (!privacyPolicy) {
      return res.status(404).json({ message: 'Privacy Policy not found' });
    }

    res.status(200).json(privacyPolicy);
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPrivacyPolicy,
  getPrivacyPolicies,
  getPrivacyPolicyBySlug,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
  getPrivacyPolicyById,
};
