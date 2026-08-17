const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetLoanSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  borrower: { type: Schema.Types.Mixed, default: {} },
  loan_date: { type: Date, default: Date.now },
  expected_return: { type: Date, default: null },
  actual_return: { type: Date, default: null },
  purpose: { type: String, trim: true },
  condition_at_issue: { type: String, trim: true },
  condition_at_return: { type: String, trim: true },
  accessories: { type: Schema.Types.Mixed, default: [] },
  damage_details: { type: String, trim: true },
  status: { type: String, trim: true, default: 'active' },
});

assetLoanSchema.index({ org_id: 1, asset_id: 1, status: 1 });

module.exports = mongoose.model('AssetLoan', assetLoanSchema, 'asset_loans');
