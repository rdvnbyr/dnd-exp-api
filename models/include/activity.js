const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.ObjectId,
      auto: true,
    },
    attachments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Attachment',
      },
    ],
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Comment can not be more than 500 characters'],
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ActivitySchema;
