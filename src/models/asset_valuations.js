const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetValuationSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
    valuation_date: { type: Date, default: Date.now },
    previous_value: { type: Schema.Types.Decimal128, default: null },
    new_value: { type: Schema.Types.Decimal128, default: null },
    change_amount: { type: Schema.Types.Decimal128, default: null },
    change_pct: { type: Number, default: null },
    valuation_method: { type: String, trim: true },
    valuation_basis: { type: String, trim: true },
    appraiser: { type: String, trim: true },
    certificate_ref: { type: String, trim: true },
    notes: { type: String, trim: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

assetValuationSchema.index({ org_id: 1, asset_id: 1, valuation_date: 1 });

module.exports = mongoose.model('AssetValuation', assetValuationSchema, 'asset_valuations');
