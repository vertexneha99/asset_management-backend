const mongoose = require('mongoose');
const { Schema } = mongoose;

const purchaseOrderSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    po_number: { type: String, required: true, trim: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    linked_request_id: { type: Schema.Types.ObjectId, ref: 'PurchaseRequest', default: null },
    order_date: { type: Date, default: Date.now },
    expected_delivery: { type: Date, default: null },
    items: { type: Schema.Types.Mixed, default: [] },
    totals: { type: Schema.Types.Mixed, default: {} },
    payment_terms: { type: String, trim: true },
    payment_status: { type: String, trim: true, default: 'pending' },
    delivery_status: { type: String, trim: true, default: 'pending' },
    warranty_terms: { type: Schema.Types.Mixed, default: null },
    amc_terms: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

purchaseOrderSchema.index({ org_id: 1, po_number: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema, 'purchase_orders');
