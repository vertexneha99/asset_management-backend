const mongoose = require('mongoose');
const { Schema } = mongoose;

const approvalActionSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  approval_instance_id: { type: Schema.Types.ObjectId, ref: 'ApprovalInstance', required: true },
  stage: { type: Number, default: null },
  original_approver_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  acted_by_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  action: { type: String, trim: true },
  delegated_from_user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  comment: { type: String, trim: true },
  acted_on: { type: Date, default: Date.now },
});

approvalActionSchema.index({ org_id: 1, approval_instance_id: 1, stage: 1 });

module.exports = mongoose.model('ApprovalAction', approvalActionSchema, 'approval_actions');
