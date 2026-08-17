const mongoose = require('mongoose');
const { Schema } = mongoose;

const maintenanceRequestSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  issue: { type: String, trim: true },
  description: { type: String, trim: true },
  priority: { type: String, trim: true },
  reported_by_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  assigned_to_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  request_date: { type: Date, default: Date.now },
  status: { type: String, trim: true, default: 'open' },
  work_order_id: { type: Schema.Types.ObjectId, ref: 'WorkOrder', default: null },
});

maintenanceRequestSchema.index({ org_id: 1, asset_id: 1, status: 1 });

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema, 'maintenance_requests');
