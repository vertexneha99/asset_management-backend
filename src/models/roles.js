const mongoose = require('mongoose');
const { Schema } = mongoose;

const roleSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  code: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  is_system_role: { type: Boolean, default: false },
  department_scoped: { type: Boolean, default: false },
});

roleSchema.index({ org_id: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Role', roleSchema, 'roles');
