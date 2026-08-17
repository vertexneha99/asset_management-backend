const mongoose = require('mongoose');
const { Schema } = mongoose;
const { WORK_ORDER_STATUS } = require('./enums');

const workOrderSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  work_order_no: { type: String, required: true, trim: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  maintenance_type: { type: String, trim: true },
  trigger: { type: String, trim: true },
  fault_description: { type: String, trim: true },
  priority: { type: String, trim: true },
  technician_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor', default: null },
  status: { type: String, enum: WORK_ORDER_STATUS, default: 'OPEN' },
  opened_date: { type: Date, default: Date.now },
  scheduled_date: { type: Date, default: null },
  started_date: { type: Date, default: null },
  completed_on: { type: Date, default: null },
  downtime_hours: { type: Number, default: null },
  work_performed: { type: String, trim: true },
  parts_used: { type: Schema.Types.Mixed, default: [] },
  labour_hours: { type: Number, default: null },
  estimated_cost: { type: Schema.Types.Decimal128, default: null },
  actual_cost: { type: Schema.Types.Decimal128, default: null },
  vendor_invoice_ref: { type: String, trim: true },
  condition_after: { type: Number, default: null },
  next_pm_date: { type: Date, default: null },
  checklist: { type: Schema.Types.Mixed, default: [] },
  notes: { type: String, trim: true },
});

workOrderSchema.index({ org_id: 1, work_order_no: 1 }, { unique: true });

module.exports = mongoose.model('WorkOrder', workOrderSchema, 'work_orders');
