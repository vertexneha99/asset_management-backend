const mongoose = require('mongoose');
const { Schema } = mongoose;

const depreciationEntrySchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  period: { type: String, trim: true },
  opening_nbv: { type: Schema.Types.Decimal128, default: null },
  depreciation_charge: { type: Schema.Types.Decimal128, default: null },
  accumulated_depreciation: { type: Schema.Types.Decimal128, default: null },
  closing_nbv: { type: Schema.Types.Decimal128, default: null },
  remaining_life_months: { type: Number, default: null },
  method_used: { type: String, trim: true },
  source_meter_reading: { type: Number, default: null },
  posted_at: { type: Date, default: Date.now },
  journal_ref: { type: String, trim: true },
});

depreciationEntrySchema.index({ org_id: 1, asset_id: 1, period: 1 }, { unique: true });

module.exports = mongoose.model('DepreciationEntry', depreciationEntrySchema, 'depreciation_entries');
