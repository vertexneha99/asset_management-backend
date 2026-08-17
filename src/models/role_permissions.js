const mongoose = require('mongoose');
const { Schema } = mongoose;

const rolePermissionSchema = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  permission_id: { type: Schema.Types.ObjectId, ref: 'Permission', required: true },
});

rolePermissionSchema.index({ role_id: 1, permission_id: 1 }, { unique: true });

module.exports = mongoose.model('RolePermission', rolePermissionSchema, 'role_permissions');
