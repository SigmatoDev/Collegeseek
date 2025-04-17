const { response } = require('express');
const TermsAndConditions = require('../../models/admin/termsConditionsModel');
const mongoose = require('mongoose');
const slugify = require('slugify'); // Ensure slugify is required

// Create a new Terms and Conditions entry
const createTerm = async (req, res) => {
  const { title, content } = req.body;

  try {
    // Generate the slug using the title
    const newTerm = new TermsAndConditions({
      title,
      content,
      slug: slugify(title, { lower: true, strict: true }), // Ensure slug is created here
    });

    await newTerm.save();
    res.status(201).json({
      message: 'Term created successfully',
      term: newTerm,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating term', error: error.message });
  }
};

// Get all Terms and Conditions entries
const getTerms = async (req, res) => {
  try {
    const terms = await TermsAndConditions.find();
    res.status(200).json(terms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching terms', error: error.message });
  }
};

// Get a specific Terms and Conditions entry by slug
const getTermBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const term = await TermsAndConditions.findOne({ slug });
    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }
    res.status(200).json(term);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching term', error: error.message });
  }
};

// Update a specific Terms and Conditions entry by ID
const updateTerm = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedTerm = await TermsAndConditions.findByIdAndUpdate(
      id,
      { title, content, slug: slugify(title, { lower: true, strict: true }), updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTerm) {
      return res.status(404).json({ message: 'Term not found' });
    }

    res.status(200).json({
      message: 'Term updated successfully',
      term: updatedTerm,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating term', error: error.message });
  }
};

// Delete a specific Terms and Conditions entry by ID
const deleteTerm = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTerm = await TermsAndConditions.findByIdAndDelete(id);

    if (!deletedTerm) {
      return res.status(404).json({ message: 'Term not found' });
    }

    res.status(200).json({ message: 'Term deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting term', error: error.message });
  }
};


const getTermById = async (req, res) => {
  try {
    const termId = req.params.id;  // This should capture the term ID from the URL
    if (!termId) {
      return res.status(400).json({ message: 'No term ID provided' });
    }

    // Log the TermsAndConditions object to ensure it's the model
    console.log('TermsAndConditions Model:', TermsAndConditions);

    const term = await TermsAndConditions.findById(termId);  // This line may be causing the issue

    if (!term) {
      return res.status(404).json({ message: 'Term not found' });
    }

    res.status(200).json(term);
  } catch (error) {
    console.error('Error fetching term:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  createTerm,
  getTerms,
  getTermBySlug,
  updateTerm,
  deleteTerm,
  getTermById,
};
