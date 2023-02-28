const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['ASSIGN', 'COMMENT', 'MENTION', 'DUE_DATE', 'CHECKLIST', 'ATTACHMENT'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },

    source: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
      required: true,
    },
    sourceType: {
      type: String,
      enum: ['task', 'comment'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
