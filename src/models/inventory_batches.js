const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventoryBatchSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  item_master_id: { type: Schema.Types.ObjectId, ref: 'ItemMaster', required: true },
  location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  batch_number: { type: String, required: true, trim: true },
  quantity_received: { type: Number, default: 0 },
  quantity_remaining: { type: Number, default: 0 },
  manufacturing_date: { type: Date, default: null },
  expiry_date: { type: Date, default: null },
  received_date: { type: Date, default: null },
  goods_receipt_id: { type: Schema.Types.ObjectId, ref: 'GoodsReceipt', default: null },
  storage_conditions_verified: { type: Boolean, default: false },
  status: { type: String, trim: true, default: 'active' },
});

inventoryBatchSchema.index({ org_id: 1, item_master_id: 1, batch_number: 1 }, { unique: true });

module.exports = mongoose.model('InventoryBatch', inventoryBatchSchema, 'inventory_batches');
