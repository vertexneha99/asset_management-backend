const mongoose = require('mongoose');
const { Schema } = mongoose;

const disposalRecordSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    disposal_method: { type: String, trim: true },
    disposal_date: { type: Date, default: null },
    disposal_reason: { type: String, trim: true },
    disposal_initiated_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approval_instance_id: { type: Schema.Types.ObjectId, ref: 'ApprovalInstance', default: null },
    condition_at_disposal: { type: String, trim: true },
    financial_snapshot: { type: Schema.Types.Mixed, default: {} },
    recipient: { type: Schema.Types.Mixed, default: {} },
    certificates: { type: Schema.Types.Mixed, default: [] },
    asset_tag_decommissioned: { type: Boolean, default: false },
    notes: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

disposalRecordSchema.index({ org_id: 1, asset_id: 1 });

module.exports = mongoose.model('DisposalRecord', disposalRecordSchema, 'disposal_records');
