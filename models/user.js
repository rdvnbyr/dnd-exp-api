const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    role: {
      type: String,
      enum: ['user', 'guest', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    workspaces: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Workspace',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
