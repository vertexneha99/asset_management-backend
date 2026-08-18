const InventoryBatch = require('../models/inventory_batches');
const ItemMaster = require('../models/item_masters');
const Location = require('../models/locations');

async function createBatch(req, res) {
  try {
    const { item_master_id, location_id, batch_number, quantity_received, manufacturing_date, expiry_date, received_date, goods_receipt_id, storage_conditions_verified } = req.body;

    if (!item_master_id || !location_id || !batch_number) {
      return res.status(400).json({ error: 'item_master_id, location_id, and batch_number are required' });
    }

    const [item, location] = await Promise.all([
      ItemMaster.findOne({ _id: item_master_id, org_id: req.orgId }),
      Location.findOne({ _id: location_id, org_id: req.orgId }),
    ]);

    if (!item) {
      return res.status(400).json({ error: 'item_master_id does not belong to your organization' });
    }
    if (!location) {
      return res.status(400).json({ error: 'location_id does not belong to your organization' });
    }

    const batch = await InventoryBatch.create({
      org_id: req.orgId,
      item_master_id,
      location_id,
      batch_number,
      quantity_received: quantity_received || 0,
      quantity_remaining: quantity_received || 0,
      manufacturing_date,
      expiry_date,
      received_date: received_date || new Date(),
      goods_receipt_id,
      storage_conditions_verified,
    });

    res.status(201).json(batch);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A batch with this batch_number already exists for this item in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listBatches(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.item_master_id) filter.item_master_id = req.query.item_master_id;
    if (req.query.location_id) filter.location_id = req.query.location_id;
    if (req.query.status) filter.status = req.query.status;

    const batches = await InventoryBatch.find(filter).sort({ received_date: -1 });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBatch(req, res) {
  try {
    const batch = await InventoryBatch.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateBatch(req, res) {
  try {
    const {
      batch_number, quantity_received, quantity_remaining, location_id,
      manufacturing_date, expiry_date, storage_conditions_verified, status,
    } = req.body;

    if (location_id) {
      const location = await Location.findOne({ _id: location_id, org_id: req.orgId });
      if (!location) {
        return res.status(400).json({ error: 'location_id does not belong to your organization' });
      }
    }

    const update = {
      batch_number, quantity_received, quantity_remaining, location_id,
      manufacturing_date, expiry_date, storage_conditions_verified, status,
    };

    const batch = await InventoryBatch.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      update,
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.json(batch);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A batch with this batch_number already exists for this item in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function deleteBatch(req, res) {
  try {
    const batch = await InventoryBatch.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    res.json({ message: 'Batch deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createBatch, listBatches, getBatch, updateBatch, deleteBatch };
