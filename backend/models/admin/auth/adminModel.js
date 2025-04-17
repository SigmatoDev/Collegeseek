const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      unique: true,
      sparse: true, // Ensure unique only when it exists
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook for adminId and password hashing
AdminSchema.pre('save', async function (next) {
  // Auto-generate adminId only on creation
  if (this.isNew) {
    const lastAdmin = await mongoose.model('Admin').findOne().sort({ createdAt: -1 });

    let lastId = 0;
    if (lastAdmin && lastAdmin.adminId) {
      const num = parseInt(lastAdmin.adminId.replace('ADMIN', ''));
      if (!isNaN(num)) {
        lastId = num;
      }
    }

    this.adminId = `ADMIN${String(lastId + 1).padStart(3, '0')}`;
  }

  // Hash password if it's new or modified
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Password matching method
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', AdminSchema);
