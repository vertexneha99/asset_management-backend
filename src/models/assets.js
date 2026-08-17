const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    asset_tag: { type: String, required: true, trim: true },
    item_master_id: { type: Schema.Types.ObjectId, ref: 'ItemMaster', required: true },
    classification: { type: Schema.Types.Mixed, default: {} },
    identity: { type: Schema.Types.Mixed, default: {} },
    description: { type: String, trim: true },
    lifecycle: { type: Schema.Types.Mixed, default: {} },
    ownership: { type: Schema.Types.Mixed, default: {} },
    acquisition: { type: Schema.Types.Mixed, default: {} },
    warranty_snapshot: { type: Schema.Types.Mixed, default: {} },
    financial_snapshot: { type: Schema.Types.Mixed, default: {} },
    insurance_snapshot: { type: Schema.Types.Mixed, default: {} },
    visibility: { type: Schema.Types.Mixed, default: {} },
    attributes: { type: Schema.Types.Mixed, default: {} },
    custom_fields: { type: Schema.Types.Mixed, default: {} },
    parent_asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
    trash: { type: Schema.Types.Mixed, default: null },
    counts_against_quota: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: 'version',
  }
);

assetSchema.index({ org_id: 1, asset_tag: 1 }, { unique: true });

module.exports = mongoose.model('Asset', assetSchema, 'assets');
