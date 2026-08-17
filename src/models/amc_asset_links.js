const mongoose = require('mongoose');
const { Schema } = mongoose;

const amcAssetLinkSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  amc_contract_id: { type: Schema.Types.ObjectId, ref: 'AmcContract', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  active: { type: Boolean, default: true },
});

amcAssetLinkSchema.index({ amc_contract_id: 1, asset_id: 1 }, { unique: true });

module.exports = mongoose.model('AmcAssetLink', amcAssetLinkSchema, 'amc_asset_links');
