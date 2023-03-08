const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionsEnum = [
  'READ',
  'WRITE',
  'DELETE',
  'SHARE',
  'UPLOAD_FILES',
  'MANAGE_MEMBERS',
  'MANAGE_LISTS',
  'MANAGE_TASKS',
  'MANAGE_BOARD',
  '_SUPER_ADMIN_PERMISSION_',
];

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
    default: ['_SUPER_ADMIN_PERMISSION_'],
  },
});

module.exports = MemberSchema;
