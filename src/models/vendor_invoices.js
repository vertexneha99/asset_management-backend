const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorInvoiceSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  invoice_number: { type: String, required: true, trim: true },
  vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  purchase_order_id: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', default: null },
  invoice_date: { type: Date, default: Date.now },
  due_date: { type: Date, default: null },
  items: { type: Schema.Types.Mixed, default: [] },
  totals: { type: Schema.Types.Mixed, default: {} },
  payment_status: { type: String, trim: true, default: 'pending' },
  payment_mode: { type: String, trim: true },
  paid_date: { type: Date, default: null },
  remarks: { type: String, trim: true },
});

vendorInvoiceSchema.index({ org_id: 1, vendor_id: 1, invoice_number: 1 }, { unique: true });

module.exports = mongoose.model('VendorInvoice', vendorInvoiceSchema, 'vendor_invoices');
