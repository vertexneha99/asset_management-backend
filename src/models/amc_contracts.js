const mongoose = require('mongoose');
const { Schema } = mongoose;

const amcContractSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  contract_number: { type: String, required: true, trim: true },
  vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  contract_amount: { type: Schema.Types.Decimal128, default: null },
  service_frequency: { type: String, trim: true },
  response_time: { type: String, trim: true },
  coverage_details: { type: String, trim: true },
  renewal_reminder_days: { type: Number, default: null },
  status: { type: String, trim: true, default: 'active' },
});

amcContractSchema.index({ org_id: 1, contract_number: 1 }, { unique: true });

module.exports = mongoose.model('AmcContract', amcContractSchema, 'amc_contracts');
