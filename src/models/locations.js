const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    type: { type: String, trim: true },
    code: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    ancestors: { type: Schema.Types.Mixed, default: [] },
    address: { type: Schema.Types.Mixed, default: {} },
    geo: { type: Schema.Types.Mixed, default: {} },
    capacity: { type: Schema.Types.Mixed, default: {} },
    responsible_employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    status: { type: String, trim: true, default: 'active' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

locationSchema.index({ org_id: 1, code: 1 }, { unique: true, partialFilterExpression: { code: { $exists: true , $type: 'string'} } });

module.exports = mongoose.model('Location', locationSchema, 'locations');
