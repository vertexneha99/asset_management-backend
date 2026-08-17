const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetRequestSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    request_no: { type: String, required: true, trim: true },
    request_type: { type: String, trim: true },
    title: { type: String, trim: true },
    requested_by_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    department_id: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
    item_master_id: { type: Schema.Types.ObjectId, ref: 'ItemMaster', default: null },
    quantity: { type: Number, default: 1 },
    estimated_cost: { type: Schema.Types.Decimal128, default: null },
    required_by: { type: Date, default: null },
    priority: { type: String, trim: true },
    justification: { type: String, trim: true },
    visibility_request: { type: Schema.Types.Mixed, default: {} },
    approval_instance_id: { type: Schema.Types.ObjectId, ref: 'ApprovalInstance', default: null },
    status: { type: String, trim: true, default: 'draft' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

assetRequestSchema.index({ org_id: 1, request_no: 1 }, { unique: true });

module.exports = mongoose.model('AssetRequest', assetRequestSchema, 'asset_requests');
