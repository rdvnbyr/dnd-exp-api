const mongoose = require('mongoose');
const ListSchema = require('./include/lists');

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name can not be more than 100 characters'],
    },
    description: {
      type: String,
      required: false,
      maxlength: [500, 'Description can not be more than 500 characters'],
      default: '',
    },
    workspaceId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    lists: [ListSchema],
    users: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
        permissions: {
          type: String,
          enum: ['admin', 'member', 'observer'],
          default: 'member',
        },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Board', BoardSchema);
