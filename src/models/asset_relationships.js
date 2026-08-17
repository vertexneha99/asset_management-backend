const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetRelationshipSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  parent_asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  child_asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  relationship_type: { type: String, trim: true },
  installed_at: { type: Date, default: null },
  removed_at: { type: Date, default: null },
});

assetRelationshipSchema.index({ parent_asset_id: 1, child_asset_id: 1 }, { unique: true });

module.exports = mongoose.model('AssetRelationship', assetRelationshipSchema, 'asset_relationships');
