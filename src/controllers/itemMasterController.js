const ItemMaster = require('../models/item_masters');

async function createItemMaster(req, res) {
  try {
    const { sku, name, category_id, brand, model, tracking_policy, unit_of_measure_id, capitalizable, default_attributes, active } = req.body;

    if (!sku || !name) {
      return res.status(400).json({ error: 'sku and name are required' });
    }

    const itemMaster = await ItemMaster.create({
      org_id: req.orgId,
      sku,
      name,
      category_id: category_id || null,
      brand,
      model,
      tracking_policy,
      unit_of_measure_id: unit_of_measure_id || null,
      capitalizable,
      default_attributes,
      active,
    });

    res.status(201).json(itemMaster);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An item master with this sku already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listItemMasters(req, res) {
  try {
    const itemMasters = await ItemMaster.find({ org_id: req.orgId }).sort({ name: 1 });
    res.json(itemMasters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItemMaster(req, res) {
  try {
    const itemMaster = await ItemMaster.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!itemMaster) {
      return res.status(404).json({ error: 'Item master not found' });
    }
    res.json(itemMaster);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateItemMaster(req, res) {
  try {
    const { sku, name, category_id, brand, model, tracking_policy, unit_of_measure_id, capitalizable, default_attributes, active } = req.body;

    const itemMaster = await ItemMaster.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { sku, name, category_id, brand, model, tracking_policy, unit_of_measure_id, capitalizable, default_attributes, active },
      { new: true, runValidators: true }
    );

    if (!itemMaster) {
      return res.status(404).json({ error: 'Item master not found' });
    }

    res.json(itemMaster);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An item master with this sku already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function deleteItemMaster(req, res) {
  try {
    const itemMaster = await ItemMaster.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!itemMaster) {
      return res.status(404).json({ error: 'Item master not found' });
    }
    res.json({ message: 'Item master deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createItemMaster, listItemMasters, getItemMaster, updateItemMaster, deleteItemMaster };
