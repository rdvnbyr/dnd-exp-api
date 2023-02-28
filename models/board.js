const mongoose = require('mongoose');
const ListSchema = require('./include/lists');
const MemberSchema = require('./include/member');

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

    lists: [ListSchema],
    users: [MemberSchema],

    workspaceId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Workspace',
      required: true,
    },
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
