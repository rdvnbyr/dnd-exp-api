const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'guest', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    licence: {
      type: String,
      enum: ['free', 'premium', 'enterprise', 'trial', 'expired'],
      default: 'free',
    },
    avatar: {
      type: String,
      default: 'default-avatar.png',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
