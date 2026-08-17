const mongoose = require('mongoose');
const { Schema } = mongoose;

const purchaseRequestSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  request_no: { type: String, required: true, trim: true },
  requested_by_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
  priority: { type: String, trim: true },
  required_date: { type: Date, default: null },
  estimated_cost: { type: Schema.Types.Decimal128, default: null },
  currency: { type: String, trim: true },
  justification: { type: String, trim: true },
  items: { type: Schema.Types.Mixed, default: [] },
  status: { type: String, trim: true, default: 'draft' },
  approval_instance_id: { type: Schema.Types.ObjectId, ref: 'ApprovalInstance', default: null },
  raised_on: { type: Date, default: Date.now },
});

purchaseRequestSchema.index({ org_id: 1, request_no: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema, 'purchase_requests');
