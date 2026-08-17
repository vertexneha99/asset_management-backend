const mongoose = require('mongoose');
const { Schema } = mongoose;
const { LIFECYCLE_STATUS } = require('./enums');

const assetLifecycleEventSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    event_type: { type: String, required: true, trim: true },
    from_state: { type: String, enum: LIFECYCLE_STATUS, default: null },
    to_state: { type: String, enum: LIFECYCLE_STATUS, required: true },
    event_date: { type: Date, default: Date.now },
    performed_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approved_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    event_source: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    attachment_refs: { type: Schema.Types.Mixed, default: [] },
    financial_impact: { type: Schema.Types.Mixed, default: null },
    prev_hash: { type: String, trim: true },
    hash: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

assetLifecycleEventSchema.index({ org_id: 1, asset_id: 1, event_date: 1 });

module.exports = mongoose.model('AssetLifecycleEvent', assetLifecycleEventSchema, 'asset_lifecycle_events');
