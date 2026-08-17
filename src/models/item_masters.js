const mongoose = require('mongoose');
const { Schema } = mongoose;
const { TRACKING_POLICY } = require('./enums');

const itemMasterSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    sku: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'AssetCategory', default: null },
    brand: { type: String, trim: true },
    model: { type: String, trim: true },
    tracking_policy: { type: String, enum: TRACKING_POLICY },
    unit_of_measure_id: { type: Schema.Types.ObjectId, ref: 'UnitOfMeasure', default: null },
    capitalizable: { type: Boolean, default: false },
    default_attributes: { type: Schema.Types.Mixed, default: {} },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

itemMasterSchema.index({ org_id: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model('ItemMaster', itemMasterSchema, 'item_masters');
