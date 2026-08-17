const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventoryBalanceSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    item_master_id: { type: Schema.Types.ObjectId, ref: 'ItemMaster', required: true },
    location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    on_hand: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    average_unit_cost: { type: Schema.Types.Decimal128, default: 0 },
  },
  {
    timestamps: { createdAt: false, updatedAt: 'updated_at' },
  }
);

inventoryBalanceSchema.index({ org_id: 1, item_master_id: 1, location_id: 1 }, { unique: true });

module.exports = mongoose.model('InventoryBalance', inventoryBalanceSchema, 'inventory_balances');
