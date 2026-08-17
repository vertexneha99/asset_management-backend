const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    employee_code: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    designation: { type: String, trim: true },
    department_id: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    email: { type: String, trim: true, lowercase: true },
    hrms_source_id: { type: String, trim: true },
    status: { type: String, trim: true, default: 'active' },
    leave_state: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

employeeSchema.index(
    { org_id: 1, employee_code: 1 }, 
    { unique: true, partialFilterExpression: { employee_code: { $exists: true, $type: 'string' } } } 
);
module.exports = mongoose.model('Employee', employeeSchema, 'employees');
