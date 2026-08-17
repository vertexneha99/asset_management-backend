const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationRecordSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  audit_id: { type: Schema.Types.ObjectId, ref: 'AuditPlan', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  expected_state: { type: Schema.Types.Mixed, default: {} },
  actual_state: { type: Schema.Types.Mixed, default: {} },
  result: { type: String, trim: true },
  verified_on: { type: Date, default: Date.now },
  verified_by_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  remarks: { type: String, trim: true },
});

verificationRecordSchema.index({ org_id: 1, audit_id: 1, asset_id: 1 }, { unique: true });

module.exports = mongoose.model('VerificationRecord', verificationRecordSchema, 'verification_records');
