const mongoose = require('mongoose');
const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    parent_department_id: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    head_employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    cost_center_code: { type: String, trim: true },
    status: { type: String, trim: true, default: 'active' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Department', departmentSchema, 'departments');
