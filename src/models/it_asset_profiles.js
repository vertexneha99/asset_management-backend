const mongoose = require('mongoose');
const { Schema } = mongoose;

const itAssetProfileSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  device_type: { type: String, trim: true },
  hardware: { type: Schema.Types.Mixed, default: {} },
  network: { type: Schema.Types.Mixed, default: {} },
  operating_system: { type: Schema.Types.Mixed, default: {} },
  security: { type: Schema.Types.Mixed, default: {} },
  mdm: { type: Schema.Types.Mixed, default: {} },
  cmdb_ci_id: { type: String, trim: true },
  last_seen_online: { type: Date, default: null },
});

itAssetProfileSchema.index({ org_id: 1, asset_id: 1 }, { unique: true });

module.exports = mongoose.model('ItAssetProfile', itAssetProfileSchema, 'it_asset_profiles');
