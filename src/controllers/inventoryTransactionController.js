const InventoryTransaction = require('../models/inventory_transactions');
const InventoryBalance = require('../models/inventory_balances');
const InventoryBatch = require('../models/inventory_batches');
const ItemMaster = require('../models/item_masters');

async function adjustBalance({ org_id, item_master_id, location_id, on_hand_delta = 0, reserved_delta = 0 }) {
  const balance = await InventoryBalance.findOneAndUpdate(
    { org_id, item_master_id, location_id },
    { $inc: { on_hand: on_hand_delta, reserved: reserved_delta } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await InventoryBalance.updateOne(
    { _id: balance._id },
    { $set: { available: balance.on_hand - balance.reserved } }
  );
  return balance.on_hand;
}

async function createTransaction(req, res) {
  try {
    const {
      item_master_id, batch_id, transaction_type, quantity,
      from_location_id, to_location_id, reference_type, reference_id, idempotency_key,
    } = req.body;

    if (idempotency_key) {
      const existing = await InventoryTransaction.findOne({ idempotency_key, org_id: req.orgId });
      if (existing) {
        return res.status(200).json(existing);
      }
    }

    if (!item_master_id || !transaction_type || quantity === undefined) {
      return res.status(400).json({ error: 'item_master_id, transaction_type, and quantity are required' });
    }

    const item = await ItemMaster.findOne({ _id: item_master_id, org_id: req.orgId });
    if (!item) {
      return res.status(400).json({ error: 'item_master_id does not belong to your organization' });
    }

    if (transaction_type !== 'ADJUSTMENT' && quantity <= 0) {
      return res.status(400).json({ error: 'quantity must be positive for this transaction_type' });
    }

    let resulting_balance;

    switch (transaction_type) {
      case 'RECEIPT':
      case 'RETURN':
        if (!to_location_id) return res.status(400).json({ error: 'to_location_id is required for this transaction_type' });
        resulting_balance = await adjustBalance({ org_id: req.orgId, item_master_id, location_id: to_location_id, on_hand_delta: quantity });
        break;

      case 'ISSUE':
      case 'CONSUMPTION':
      case 'EXPIRY':
        if (!from_location_id) return res.status(400).json({ error: 'from_location_id is required for this transaction_type' });
        if (batch_id) {
          const batch = await InventoryBatch.findOne({ _id: batch_id, org_id: req.orgId });
          if (!batch) return res.status(400).json({ error: 'batch_id does not belong to your organization' });
          if (batch.quantity_remaining < quantity) {
            return res.status(409).json({ error: 'Insufficient quantity remaining in this batch' });
          }
          batch.quantity_remaining -= quantity;
          await batch.save();
        }
        resulting_balance = await adjustBalance({ org_id: req.orgId, item_master_id, location_id: from_location_id, on_hand_delta: -quantity });
        break;

      case 'TRANSFER':
        if (!from_location_id || !to_location_id) {
          return res.status(400).json({ error: 'from_location_id and to_location_id are both required for TRANSFER' });
        }
        await adjustBalance({ org_id: req.orgId, item_master_id, location_id: from_location_id, on_hand_delta: -quantity });
        resulting_balance = await adjustBalance({ org_id: req.orgId, item_master_id, location_id: to_location_id, on_hand_delta: quantity });
        break;

      case 'RESERVATION':
        if (!to_location_id) return res.status(400).json({ error: 'to_location_id is required for RESERVATION' });
        resulting_balance = await adjustBalance({ org_id: req.orgId, item_master_id, location_id: to_location_id, reserved_delta: quantity });
        break;

      case 'RELEASE':
        if (!from_location_id) return res.status(400).json({ error: 'from_location_id is required for RELEASE' });
        resulting_balance = await adjustBalance({ org_id: req.orgId, item_master_id, location_id: from_location_id, reserved_delta: -quantity });
        break;

      case 'ADJUSTMENT':
        if (!to_location_id) return res.status(400).json({ error: 'to_location_id is required for ADJUSTMENT' });
        resulting_balance = await adjustBalance({ org_id: req.orgId, item_master_id, location_id: to_location_id, on_hand_delta: quantity });
        break;

      default:
        return res.status(400).json({ error: 'Unknown transaction_type' });
    }

    const transaction = await InventoryTransaction.create({
      org_id: req.orgId,
      item_master_id,
      batch_id,
      transaction_type,
      quantity,
      from_location_id,
      to_location_id,
      reference_type,
      reference_id,
      actor_id: req.userId,
      resulting_balance,
      idempotency_key,
    });

    res.status(201).json(transaction);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Duplicate idempotency_key' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listTransactions(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.item_master_id) filter.item_master_id = req.query.item_master_id;
    if (req.query.batch_id) filter.batch_id = req.query.batch_id;
    if (req.query.transaction_type) filter.transaction_type = req.query.transaction_type;

    const transactions = await InventoryTransaction.find(filter).sort({ created_at: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTransaction(req, res) {
  try {
    const transaction = await InventoryTransaction.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createTransaction, listTransactions, getTransaction };
