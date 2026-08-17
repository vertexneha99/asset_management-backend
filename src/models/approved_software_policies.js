const mongoose = require('mongoose');
const { Schema } = mongoose;

const approvedSoftwarePolicySchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  software_id: { type: Schema.Types.ObjectId, ref: 'SoftwareCatalog', required: true },
  approved_versions: { type: Schema.Types.Mixed, default: [] },
  approval_status: { type: String, trim: true, default: 'pending' },
  license_required: { type: Boolean, default: true },
  allowed_role_ids: { type: Schema.Types.Mixed, default: [] },
  max_installations: { type: Number, default: null },
  approved_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  approval_date: { type: Date, default: null },
  notes: { type: String, trim: true },
});

approvedSoftwarePolicySchema.index({ org_id: 1, software_id: 1 }, { unique: true });

module.exports = mongoose.model('ApprovedSoftwarePolicy', approvedSoftwarePolicySchema, 'approved_software_policies');
