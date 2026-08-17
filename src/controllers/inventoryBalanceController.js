const InventoryBalance = require('../models/inventory_balances');

async function listInventoryBalances(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.item_master_id) filter.item_master_id = req.query.item_master_id;
    if (req.query.location_id) filter.location_id = req.query.location_id;

    const balances = await InventoryBalance.find(filter);
    res.json(balances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getInventoryBalance(req, res) {
  try {
    const balance = await InventoryBalance.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!balance) {
      return res.status(404).json({ error: 'Inventory balance not found' });
    }
    res.json(balance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listInventoryBalances, getInventoryBalance };
