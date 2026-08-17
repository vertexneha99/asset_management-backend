const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceRecordSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  work_order_id: { type: Schema.Types.ObjectId, ref: 'WorkOrder', default: null },
  service_date: { type: Date, default: Date.now },
  service_type: { type: String, trim: true },
  performed_by_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  cost: { type: Schema.Types.Decimal128, default: null },
  downtime_hours: { type: Number, default: null },
  outcome: { type: String, trim: true },
  remarks: { type: String, trim: true },
});

serviceRecordSchema.index({ org_id: 1, asset_id: 1, service_date: 1 });

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema, 'service_records');
