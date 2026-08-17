const mongoose = require('mongoose');
const { Schema } = mongoose;

const warrantyClaimSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  warranty_id: { type: Schema.Types.ObjectId, ref: 'Warranty', required: true },
  claim_date: { type: Date, default: Date.now },
  issue: { type: String, trim: true },
  status: { type: String, trim: true, default: 'open' },
  claim_amount: { type: Schema.Types.Decimal128, default: null },
  resolution_date: { type: Date, default: null },
  raised_by_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  remarks: { type: String, trim: true },
});

warrantyClaimSchema.index({ org_id: 1, warranty_id: 1, claim_date: 1 });

module.exports = mongoose.model('WarrantyClaim', warrantyClaimSchema, 'warranty_claims');
