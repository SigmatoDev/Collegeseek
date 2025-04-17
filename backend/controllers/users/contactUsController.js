// controllers/contactController.js
const Contact = require('../../models/users/contactUsModel');

function submitContactForm(req, res) {
  try {
    const { name, email, phone, message } = req.body;

    // Create a new contact document
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    // Save the contact data to the database
    newContact.save()
      .then(() => {
        res.status(200).json({
          message: 'Message sent successfully',
          contact: newContact,
        });
      })
      .catch((error) => {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
          message: 'Failed to submit contact form',
        });
      });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      message: 'Failed to submit contact form',
    });
  }
}

module.exports = {
  submitContactForm,
};
