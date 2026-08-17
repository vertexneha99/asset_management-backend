const mongoose = require('mongoose');
const { Schema } = mongoose;

const incidentSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
  title: { type: String, required: true, trim: true },
  type: { type: String, trim: true },
  reported_by_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  reported_on: { type: Date, default: Date.now },
  severity: { type: String, trim: true },
  stage: { type: String, trim: true },
  status: { type: String, trim: true, default: 'open' },
  assigned_to_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  location_id: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
  description: { type: String, trim: true },
  resolution: { type: String, trim: true },
  resolved_on: { type: Date, default: null },
  work_order_id: { type: Schema.Types.ObjectId, ref: 'WorkOrder', default: null },
});

incidentSchema.index({ org_id: 1, status: 1 });

module.exports = mongoose.model('Incident', incidentSchema, 'incidents');
