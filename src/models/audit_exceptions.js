const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditExceptionSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  audit_id: { type: Schema.Types.ObjectId, ref: 'AuditPlan', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  exception_type: { type: String, trim: true },
  severity: { type: String, trim: true },
  details: { type: String, trim: true },
  status: { type: String, trim: true, default: 'open' },
  assigned_to_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  raised_on: { type: Date, default: Date.now },
  resolved_on: { type: Date, default: null },
});

auditExceptionSchema.index({ org_id: 1, audit_id: 1, status: 1 });

module.exports = mongoose.model('AuditException', auditExceptionSchema, 'audit_exceptions');
