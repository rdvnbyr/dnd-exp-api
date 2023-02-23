const mongoose = require('mongoose');
const TaskSchema = require('./task');

const ListSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      maxlength: [500, 'Name can not be more than 500 characters'],
    },
    tasks: {
      type: [TaskSchema],
      default: [],
    },
    joinedUsers: [
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

module.exports = ListSchema;
