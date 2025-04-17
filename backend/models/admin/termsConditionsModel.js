const mongoose = require('mongoose');
const slugify = require('slugify');

const TermsAndConditionsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TermsAndConditionsSchema.pre('save', function (next) {
  if (this.title && this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  this.updatedAt = Date.now();
  next();
});

const TermsAndConditions = mongoose.model('TermsAndConditions', TermsAndConditionsSchema);

module.exports = TermsAndConditions;
