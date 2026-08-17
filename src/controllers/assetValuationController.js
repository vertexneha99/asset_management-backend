const AssetValuation = require('../models/asset_valuations');
const Asset = require('../models/assets');

async function createAssetValuation(req, res) {
  try {
    const { asset_id, previous_value, new_value, valuation_method, valuation_basis, appraiser, certificate_ref, notes } = req.body;

    if (!asset_id || new_value === undefined) {
      return res.status(400).json({ error: 'asset_id and new_value are required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    let change_amount = null;
    let change_pct = null;
    if (previous_value !== undefined && previous_value !== null) {
      change_amount = new_value - previous_value;
      change_pct = previous_value !== 0 ? (change_amount / previous_value) * 100 : null;
    }

    const valuation = await AssetValuation.create({
      org_id: req.orgId,
      asset_id,
      previous_value,
      new_value,
      change_amount,
      change_pct,
      valuation_method,
      valuation_basis,
      appraiser,
      certificate_ref,
      notes,
      created_by: req.userId,
    });

    res.status(201).json(valuation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listAssetValuations(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const valuations = await AssetValuation.find(filter).sort({ valuation_date: -1 });
    res.json(valuations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAssetValuation(req, res) {
  try {
    const valuation = await AssetValuation.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!valuation) {
      return res.status(404).json({ error: 'Asset valuation not found' });
    }
    res.json(valuation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAssetValuation, listAssetValuations, getAssetValuation };
