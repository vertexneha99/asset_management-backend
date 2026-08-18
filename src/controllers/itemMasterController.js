const ItemMaster = require('../models/item_masters');
const InventoryBalance = require('../models/inventory_balances');
const AssetCategory = require('../models/asset_categories');

function computeStatus(quantityInStock, minReorderLevel) {
  if (quantityInStock <= 0) return 'Out of Stock';
  if (quantityInStock <= minReorderLevel) return 'Low Stock';
  return 'In Stock';
}

async function withStockFields(itemMasters, orgId) {
  const items = Array.isArray(itemMasters) ? itemMasters : [itemMasters];
  const ids = items.map((i) => i._id);

  const balances = await InventoryBalance.aggregate([
    { $match: { org_id: orgId, item_master_id: { $in: ids } } },
    { $group: { _id: '$item_master_id', quantity_in_stock: { $sum: '$on_hand' } } },
  ]);
  const balanceMap = new Map(balances.map((b) => [String(b._id), b.quantity_in_stock]));

  const enriched = items.map((item) => {
    const obj = item.toObject();
    const quantity_in_stock = balanceMap.get(String(item._id)) || 0;
    obj.quantity_in_stock = quantity_in_stock;
    obj.status = computeStatus(quantity_in_stock, item.min_reorder_level || 0);
    return obj;
  });

  return Array.isArray(itemMasters) ? enriched : enriched[0];
}

function skuPrefixFromCategoryName(name) {
  const letters = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return (letters.slice(0, 3) || 'ITM').padEnd(3, 'X');
}

function datePart() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

function randomSuffix() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function generateSku(req, res) {
  try {
    let prefix = 'ITM';

    if (req.query.category_id) {
      const category = await AssetCategory.findOne({ _id: req.query.category_id, org_id: req.orgId });
      if (category) {
        prefix = skuPrefixFromCategoryName(category.name);
      }
    }

    const datestamp = datePart();

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidate = `${prefix}-${datestamp}-${randomSuffix()}`;
      const exists = await ItemMaster.exists({ org_id: req.orgId, sku: candidate });
      if (!exists) {
        return res.json({ sku: candidate });
      }
    }

    return res.status(500).json({ error: 'Could not generate a unique SKU, please try again' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createItemMaster(req, res) {
  try {
    const {
      sku, name, category_id, brand, model, tracking_policy, unit_of_measure_id,
      capitalizable, default_attributes, active, description, supplier_id,
      location_id, unit_cost, min_reorder_level, qr_code_url,
    } = req.body;

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
      description,
      supplier_id: supplier_id || null,
      location_id: location_id || null,
      unit_cost,
      min_reorder_level,
      qr_code_url,
    });

    const enriched = await withStockFields(itemMaster, req.orgId);
    res.status(201).json(enriched);
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
    const enriched = await withStockFields(itemMasters, req.orgId);
    res.json(enriched);
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
    const enriched = await withStockFields(itemMaster, req.orgId);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateItemMaster(req, res) {
  try {
    const {
      sku, name, category_id, brand, model, tracking_policy, unit_of_measure_id,
      capitalizable, default_attributes, active, description, supplier_id,
      location_id, unit_cost, min_reorder_level, qr_code_url,
    } = req.body;

    const itemMaster = await ItemMaster.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      {
        sku, name, category_id, brand, model, tracking_policy, unit_of_measure_id,
        capitalizable, default_attributes, active, description, supplier_id,
        location_id, unit_cost, min_reorder_level, qr_code_url,
      },
      { new: true, runValidators: true }
    );

    if (!itemMaster) {
      return res.status(404).json({ error: 'Item master not found' });
    }

    const enriched = await withStockFields(itemMaster, req.orgId);
    res.json(enriched);
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

module.exports = { generateSku, createItemMaster, listItemMasters, getItemMaster, updateItemMaster, deleteItemMaster };
