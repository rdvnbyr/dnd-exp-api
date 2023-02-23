const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
  _id: false,
  size: {
    type: Number,
    required: [true, 'Please add a size'],
  },
  mimetype: {
    type: String,
    required: [true, 'Please add a mimetype'],
  },
});

const AttachmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    path: {
      type: String,
      required: [true, 'Please add a path'],
    },
    details: {
      type: DetailsSchema,
      required: false,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Attachment', AttachmentSchema);
