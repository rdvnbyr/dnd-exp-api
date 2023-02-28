const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  _id: false,

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  role: {
    type: String,
    enum: ['owner', 'member', 'guest', 'observer'],
    default: 'member',
  },

  permissions: {
    type: [String],
    default: [
      'READ',
      'WRITE',
      'DELETE',
      'SHARE',
      'UPLOAD_FILES',
      'MANAGE_MEMBERS',
      'MANAGE_LISTS',
      'MANAGE_TASKS',
    ],
  },
});

module.exports = MemberSchema;
