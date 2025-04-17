const mongoose = require('mongoose');

const userShortlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College', // Assuming you have a College model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserShortlist = mongoose.model('UserShortlist', userShortlistSchema);

module.exports = UserShortlist;
