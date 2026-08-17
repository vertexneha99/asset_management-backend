const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetCategorySchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    code: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    parent_category_id: { type: Schema.Types.ObjectId, ref: 'AssetCategory', default: null },
    financial_config: { type: Schema.Types.Mixed, default: {} },
    tracking_config: { type: Schema.Types.Mixed, default: {} },
    requirements: { type: Schema.Types.Mixed, default: {} },
    default_uom_id: { type: Schema.Types.ObjectId, ref: 'UnitOfMeasure', default: null },
    id_format: { type: String, trim: true },
    schema_version: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

assetCategorySchema.index({ org_id: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('AssetCategory', assetCategorySchema, 'asset_categories');
