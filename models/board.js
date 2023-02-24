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
        permission: {
          type: String,
          enum: ['admin', 'member', 'observer', 'guest'],
          default: 'guest',
        },
        _id: false,
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

module.exports = mongoose.model('Board', BoardSchema);
