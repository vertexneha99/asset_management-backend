const mongoose = require('mongoose');
const { Schema } = mongoose;

const assetAssignmentSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  assigned_to_type: { type: String, required: true, trim: true },
  assigned_to_id: { type: Schema.Types.ObjectId, required: true, refPath: 'assigned_to_type' },
  assigned_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  assignment_date: { type: Date, default: Date.now },
  expected_return_date: { type: Date, default: null },
  actual_return_date: { type: Date, default: null },
  handover: { type: Schema.Types.Mixed, default: {} },
  return_details: { type: Schema.Types.Mixed, default: {} },
  acknowledgement: { type: Schema.Types.Mixed, default: {} },
  status: { type: String, trim: true, default: 'active' },
});

assetAssignmentSchema.index({ org_id: 1, asset_id: 1, status: 1 });

module.exports = mongoose.model('AssetAssignment', assetAssignmentSchema, 'asset_assignments');
