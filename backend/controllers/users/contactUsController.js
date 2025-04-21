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

function getContacts(req, res) {
  try {
    Contact.find()
      .then((contacts) => {
        res.status(200).json({
          contacts,
        });
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
          message: 'Failed to fetch contacts',
        });
      });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      message: 'Failed to fetch contacts',
    });
  }
}

function getContactById(req, res) {
  const { id } = req.params;

  try {
    Contact.findById(id)
      .then((contact) => {
        if (!contact) {
          return res.status(404).json({
            message: 'Contact not found',
          });
        }

        res.status(200).json({
          contact,
        });
      })
      .catch((error) => {
        console.error('Error fetching contact by ID:', error);
        res.status(500).json({
          message: 'Failed to fetch contact by ID',
        });
      });
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    res.status(500).json({
      message: 'Failed to fetch contact by ID',
    });
  }
}

function deleteContact(req, res) {
  const { id } = req.params;

  try {
    Contact.findByIdAndDelete(id)
      .then((contact) => {
        if (!contact) {
          return res.status(404).json({
            message: 'Contact not found',
          });
        }

        res.status(200).json({
          message: 'Contact deleted successfully',
        });
      })
      .catch((error) => {
        console.error('Error deleting contact:', error);
        res.status(500).json({
          message: 'Failed to delete contact',
        });
      });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      message: 'Failed to delete contact',
    });
  }
}

module.exports = {
  submitContactForm,
  getContacts,
  getContactById,
  deleteContact,
};


