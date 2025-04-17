const mongoose = require('mongoose');
const slugify = require('slugify');

const PrivacyPolicySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PrivacyPolicySchema.pre('save', function (next) {
  if (this.title && this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  this.updatedAt = Date.now();
  next();
});

const PrivacyPolicy = mongoose.model('PrivacyPolicy', PrivacyPolicySchema);

module.exports = PrivacyPolicy;
