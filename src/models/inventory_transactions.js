const mongoose = require('mongoose');
const { Schema } = mongoose;
const { INVENTORY_TRANSACTION_TYPE } = require('./enums');

const inventoryTransactionSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    item_master_id: { type: Schema.Types.ObjectId, ref: 'ItemMaster', required: true },
    batch_id: { type: Schema.Types.ObjectId, ref: 'InventoryBatch', default: null },
    transaction_type: { type: String, enum: INVENTORY_TRANSACTION_TYPE, required: true },
    quantity: { type: Number, required: true },
    from_location_id: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    to_location_id: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    reference_type: { type: String, trim: true },
    reference_id: { type: Schema.Types.ObjectId, default: null },
    actor_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    resulting_balance: { type: Number, default: null },
    idempotency_key: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

inventoryTransactionSchema.index(
  { idempotency_key: 1 },
  { unique: true, partialFilterExpression: { idempotency_key: { $exists: true, $type: 'string' } } }
);
inventoryTransactionSchema.index({ org_id: 1, item_master_id: 1, created_at: 1 });

module.exports = mongoose.model('InventoryTransaction', inventoryTransactionSchema, 'inventory_transactions');
