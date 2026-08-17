const mongoose = require('mongoose');
const { Schema } = mongoose;

const depreciationProfileSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    method: { type: String, trim: true },
    purchase_cost: { type: Schema.Types.Decimal128, default: null },
    capitalization_date: { type: Date, default: null },
    useful_life_months: { type: Number, default: null },
    salvage_value: { type: Schema.Types.Decimal128, default: null },
    depreciation_rate_pct: { type: Number, default: null },
    frequency: { type: String, trim: true },
    total_estimated_units: { type: Number, default: null },
    current_accumulated_depreciation: { type: Schema.Types.Decimal128, default: 0 },
    current_net_book_value: { type: Schema.Types.Decimal128, default: null },
    fully_depreciated_date: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'updated_at' },
  }
);

depreciationProfileSchema.index({ org_id: 1, asset_id: 1 }, { unique: true });

module.exports = mongoose.model('DepreciationProfile', depreciationProfileSchema, 'depreciation_profiles');
