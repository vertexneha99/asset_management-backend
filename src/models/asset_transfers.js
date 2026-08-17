const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetTransferSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    from_context: { type: Schema.Types.Mixed, default: {} },
    to_context: { type: Schema.Types.Mixed, default: {} },
    transfer_date: { type: Date, default: Date.now },
    reason: { type: String, trim: true },
    approver_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    condition_before: { type: String, trim: true },
    condition_after: { type: String, trim: true },
    status: { type: String, trim: true, default: 'pending' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

assetTransferSchema.index({ org_id: 1, asset_id: 1, transfer_date: 1 });

module.exports = mongoose.model('AssetTransfer', assetTransferSchema, 'asset_transfers');
