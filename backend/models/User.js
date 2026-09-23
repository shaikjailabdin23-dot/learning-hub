const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    college: {
      type: String,
      default: 'Global Institute of Technology',
      trim: true,
    },
    branch: {
      type: String,
      default: 'Computer Science and Engineering',
      trim: true,
    },
    year: {
      type: String,
      default: '1st Year',
      trim: true,
    },
    semester: {
      type: String,
      default: '1st Semester',
      trim: true,
    },
    streak: {
      type: Number,
      default: 7,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
