const mongoose = require('mongoose');
const { Schema } = mongoose;

const softwareLicenseSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  software_id: { type: Schema.Types.ObjectId, ref: 'SoftwareCatalog', required: true },
  license_type: { type: String, trim: true },
  procurement_id: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', default: null },
  license_key_encrypted: { type: String, select: false },
  total_seats: { type: Number, default: null },
  assigned_seats: { type: Number, default: 0 },
  effective_date: { type: Date, default: null },
  expiry_date: { type: Date, default: null },
  renewal_reminder_days: { type: Number, default: null },
  auto_renew: { type: Boolean, default: false },
  annual_cost: { type: Schema.Types.Decimal128, default: null },
  next_renewal_amount: { type: Schema.Types.Decimal128, default: null },
  budget_code: { type: String, trim: true },
  compliance_status: { type: String, trim: true },
  status: { type: String, trim: true, default: 'active' },
});

softwareLicenseSchema.index({ org_id: 1, software_id: 1, license_type: 1 });

module.exports = mongoose.model('SoftwareLicense', softwareLicenseSchema, 'software_licenses');
