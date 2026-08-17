const DepreciationProfile = require('../models/depreciation_profiles');
const Asset = require('../models/assets');

async function createDepreciationProfile(req, res) {
  try {
    const { asset_id, method, purchase_cost, capitalization_date, useful_life_months, salvage_value, depreciation_rate_pct, frequency, total_estimated_units } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const profile = await DepreciationProfile.create({
      org_id: req.orgId,
      asset_id,
      method,
      purchase_cost,
      capitalization_date,
      useful_life_months,
      salvage_value,
      depreciation_rate_pct,
      frequency,
      total_estimated_units,
      current_accumulated_depreciation: 0,
      current_net_book_value: purchase_cost,
    });

    res.status(201).json(profile);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A depreciation profile already exists for this asset' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listDepreciationProfiles(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const profiles = await DepreciationProfile.find(filter);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDepreciationProfile(req, res) {
  try {
    const profile = await DepreciationProfile.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!profile) {
      return res.status(404).json({ error: 'Depreciation profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateDepreciationProfile(req, res) {
  try {
    const { method, useful_life_months, salvage_value, depreciation_rate_pct, frequency, total_estimated_units, fully_depreciated_date } = req.body;

    const profile = await DepreciationProfile.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { method, useful_life_months, salvage_value, depreciation_rate_pct, frequency, total_estimated_units, fully_depreciated_date },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ error: 'Depreciation profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDepreciationProfile(req, res) {
  try {
    const profile = await DepreciationProfile.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!profile) {
      return res.status(404).json({ error: 'Depreciation profile not found' });
    }
    res.json({ message: 'Depreciation profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createDepreciationProfile, listDepreciationProfiles, getDepreciationProfile, updateDepreciationProfile, deleteDepreciationProfile };
