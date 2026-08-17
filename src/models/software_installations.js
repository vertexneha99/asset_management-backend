const mongoose = require('mongoose');
const { Schema } = mongoose;

const softwareInstallationSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  device_asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  software_id: { type: Schema.Types.ObjectId, ref: 'SoftwareCatalog', required: true },
  version: { type: String, trim: true },
  build_number: { type: String, trim: true },
  installation_type: { type: String, trim: true },
  installation_date: { type: Date, default: Date.now },
  installed_by_method: { type: String, trim: true },
  installed_by_user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  license_id: { type: Schema.Types.ObjectId, ref: 'SoftwareLicense', default: null },
  installation_path: { type: String, trim: true },
  installer_hash: { type: String, trim: true },
  install_source: { type: String, trim: true },
  authorized: { type: Boolean, default: false },
  approval_id: { type: Schema.Types.ObjectId, ref: 'ApprovalInstance', default: null },
  uninstallation_date: { type: Date, default: null },
  uninstalled_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  uninstall_reason: { type: String, trim: true },
  current_status: { type: String, trim: true, default: 'installed' },
  notes: { type: String, trim: true },
});

softwareInstallationSchema.index({ org_id: 1, device_asset_id: 1, software_id: 1 });

module.exports = mongoose.model('SoftwareInstallation', softwareInstallationSchema, 'software_installations');
