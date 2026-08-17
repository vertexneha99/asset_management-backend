const mongoose = require('mongoose');
const { Schema } = mongoose;

const approvalDelegationSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  original_approver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  substitute_approver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, trim: true },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  active: { type: Boolean, default: true },
});

approvalDelegationSchema.index({ org_id: 1, original_approver_id: 1, active: 1 });

module.exports = mongoose.model('ApprovalDelegation', approvalDelegationSchema, 'approval_delegations');
