const mongoose = require('mongoose');
const validator = require('express-validator');

const WorkspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    description: {
      type: String,
      required: false,
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        permission: {
          type: String,
          enum: ['admin', 'member', 'observer', 'guest'],
          default: 'guest',
        },
        _id: false,
      },
    ],
    boards: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Board',
      },
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workspace', WorkspaceSchema);
