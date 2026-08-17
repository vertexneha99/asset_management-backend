const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditPlanSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, trim: true },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
  location_id: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
  category_id: { type: Schema.Types.ObjectId, ref: 'AssetCategory', default: null },
  auditor_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  status: { type: String, trim: true, default: 'planned' },
  counters: { type: Schema.Types.Mixed, default: {} },
});

module.exports = mongoose.model('AuditPlan', auditPlanSchema, 'audit_plans');
