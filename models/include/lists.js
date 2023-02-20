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
    joinedUsers: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ListSchema;
