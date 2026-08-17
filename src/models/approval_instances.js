const mongoose = require('mongoose');
const { Schema } = mongoose;
const { APPROVAL_STATUS } = require('./enums');

const approvalInstanceSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    approvable_type: { type: String, required: true, trim: true },
    approvable_id: { type: Schema.Types.ObjectId, required: true },
    template_id: { type: Schema.Types.ObjectId, ref: 'ApprovalTemplate', required: true },
    template_version: { type: Number, default: null },
    requester_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: APPROVAL_STATUS, default: 'DRAFT' },
    current_stage: { type: Number, default: 0 },
    resolved_steps: { type: Schema.Types.Mixed, default: [] },
    routing_context: { type: Schema.Types.Mixed, default: {} },
    completed_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

approvalInstanceSchema.index({ org_id: 1, approvable_type: 1, approvable_id: 1 });

module.exports = mongoose.model('ApprovalInstance', approvalInstanceSchema, 'approval_instances');
