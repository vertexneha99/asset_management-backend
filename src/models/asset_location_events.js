const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetLocationEventSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  from_location_id: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
  to_location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  moved_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  moved_at: { type: Date, default: Date.now },
  reason: { type: String, trim: true },
});

assetLocationEventSchema.index({ org_id: 1, asset_id: 1, moved_at: 1 });

module.exports = mongoose.model('AssetLocationEvent', assetLocationEventSchema, 'asset_location_events');
