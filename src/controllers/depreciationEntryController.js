const DepreciationEntry = require('../models/depreciation_entries');
const DepreciationProfile = require('../models/depreciation_profiles');
const Asset = require('../models/assets');

async function createDepreciationEntry(req, res) {
  try {
    const { asset_id, period, opening_nbv, depreciation_charge, accumulated_depreciation, closing_nbv, remaining_life_months, method_used, source_meter_reading, journal_ref } = req.body;

    if (!asset_id || !period) {
      return res.status(400).json({ error: 'asset_id and period are required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const entry = await DepreciationEntry.create({
      org_id: req.orgId,
      asset_id,
      period,
      opening_nbv,
      depreciation_charge,
      accumulated_depreciation,
      closing_nbv,
      remaining_life_months,
      method_used,
      source_meter_reading,
      journal_ref,
    });

    await DepreciationProfile.findOneAndUpdate(
      { org_id: req.orgId, asset_id },
      {
        current_accumulated_depreciation: accumulated_depreciation,
        current_net_book_value: closing_nbv,
      }
    );

    res.status(201).json(entry);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A depreciation entry for this asset and period already exists' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listDepreciationEntries(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const entries = await DepreciationEntry.find(filter).sort({ posted_at: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDepreciationEntry(req, res) {
  try {
    const entry = await DepreciationEntry.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!entry) {
      return res.status(404).json({ error: 'Depreciation entry not found' });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createDepreciationEntry, listDepreciationEntries, getDepreciationEntry };
