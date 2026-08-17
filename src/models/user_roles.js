const mongoose = require('mongoose');
const { Schema } = mongoose;

const userRoleSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
  assigned_at: { type: Date, default: Date.now },
});

userRoleSchema.index({ user_id: 1, role_id: 1, department_id: 1 }, { unique: true });

module.exports = mongoose.model('UserRole', userRoleSchema, 'user_roles');
