const mongoose = require('mongoose');
const { Schema } = mongoose;

const goodsReceiptSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    grn_number: { type: String, required: true, trim: true },
    purchase_order_id: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    vendor_id: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    received_date: { type: Date, default: Date.now },
    inspection_status: { type: String, trim: true, default: 'pending' },
    inspected_by_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    items: { type: Schema.Types.Mixed, default: [] },
    checklist: { type: Schema.Types.Mixed, default: [] },
    remarks: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

goodsReceiptSchema.index({ org_id: 1, grn_number: 1 }, { unique: true });

module.exports = mongoose.model('GoodsReceipt', goodsReceiptSchema, 'goods_receipts');
