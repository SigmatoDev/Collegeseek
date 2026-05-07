
const PrivacyPolicy = require('../../models/admin/privacyPolicyModel'); // same model
const slugify = require('slugify');

const createDisclaimer = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newDisclaimer = new PrivacyPolicy({
      title,
      content,
      slug: slugify(title, { lower: true, strict: true }),
      type: 'disclaimer', // 👈 tag it
    });
    await newDisclaimer.save();
    res.status(201).json({ message: 'Disclaimer created successfully', disclaimer: newDisclaimer });
  } catch (error) {
    res.status(500).json({ message: 'Error creating disclaimer', error: error.message });
  }
};

const getDisclaimers = async (req, res) => {
  try {
    const disclaimers = await PrivacyPolicy.find({ type: 'disclaimer' }); // 👈 filter
    res.status(200).json(disclaimers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disclaimers', error: error.message });
  }
};

const getDisclaimerBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const disclaimer = await PrivacyPolicy.findOne({ slug, type: 'disclaimer' }); // 👈 filter
    if (!disclaimer) return res.status(404).json({ message: 'Disclaimer not found' });
    res.status(200).json(disclaimer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching disclaimer', error: error.message });
  }
};

const updateDisclaimer = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const updated = await PrivacyPolicy.findOneAndUpdate(
      { _id: id, type: 'disclaimer' }, // 👈 filter so you can't accidentally edit a privacy policy
      { title, content, slug: slugify(title, { lower: true, strict: true }), updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Disclaimer not found' });
    res.status(200).json({ message: 'Disclaimer updated successfully', disclaimer: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating disclaimer', error: error.message });
  }
};

const deleteDisclaimer = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await PrivacyPolicy.findOneAndDelete({ _id: id, type: 'disclaimer' }); // 👈 filter
    if (!deleted) return res.status(404).json({ message: 'Disclaimer not found' });
    res.status(200).json({ message: 'Disclaimer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting disclaimer', error: error.message });
  }
};

const getDisclaimerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'No disclaimer ID provided' });
    const disclaimer = await PrivacyPolicy.findOne({ _id: id, type: 'disclaimer' }); // 👈 filter
    if (!disclaimer) return res.status(404).json({ message: 'Disclaimer not found' });
    res.status(200).json(disclaimer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createDisclaimer,
  getDisclaimers,
  getDisclaimerBySlug,
  updateDisclaimer,
  deleteDisclaimer,
  getDisclaimerById,
};