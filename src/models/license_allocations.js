const mongoose = require('mongoose');
const { Schema } = mongoose;

const licenseAllocationSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  license_id: { type: Schema.Types.ObjectId, ref: 'SoftwareLicense', required: true },
  assigned_to_type: { type: String, trim: true },
  assigned_to_id: { type: Schema.Types.ObjectId, default: null },
  installation_id: { type: Schema.Types.ObjectId, ref: 'SoftwareInstallation', default: null },
  allocated_on: { type: Date, default: Date.now },
  assigned_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, trim: true, default: 'active' },
  last_used: { type: Date, default: null },
  deallocated_date: { type: Date, default: null },
  reason_for_deallocation: { type: String, trim: true },
});

licenseAllocationSchema.index({ org_id: 1, license_id: 1, status: 1 });

module.exports = mongoose.model('LicenseAllocation', licenseAllocationSchema, 'license_allocations');
