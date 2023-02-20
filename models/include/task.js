const mongoose = require('mongoose');
const ActivitySchema = require('./activity');

const TaskSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: false,
      default: '',
    },
    activities: {
      type: [ActivitySchema],
      default: [],
    },
    labels: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
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

module.exports = TaskSchema;
