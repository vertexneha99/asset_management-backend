const ItAssetProfile = require('../models/it_asset_profiles');
const Asset = require('../models/assets');

async function createItAssetProfile(req, res) {
  try {
    const { asset_id, device_type, hardware, network, operating_system, security, mdm, cmdb_ci_id } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const profile = await ItAssetProfile.create({
      org_id: req.orgId,
      asset_id,
      device_type,
      hardware,
      network,
      operating_system,
      security,
      mdm,
      cmdb_ci_id,
    });

    res.status(201).json(profile);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An IT asset profile already exists for this asset' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listItAssetProfiles(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const profiles = await ItAssetProfile.find(filter);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getItAssetProfile(req, res) {
  try {
    const profile = await ItAssetProfile.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!profile) {
      return res.status(404).json({ error: 'IT asset profile not found' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateItAssetProfile(req, res) {
  try {
    const { device_type, hardware, network, operating_system, security, mdm, cmdb_ci_id, last_seen_online } = req.body;

    const profile = await ItAssetProfile.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { device_type, hardware, network, operating_system, security, mdm, cmdb_ci_id, last_seen_online },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ error: 'IT asset profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteItAssetProfile(req, res) {
  try {
    const profile = await ItAssetProfile.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!profile) {
      return res.status(404).json({ error: 'IT asset profile not found' });
    }
    res.json({ message: 'IT asset profile deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createItAssetProfile, listItAssetProfiles, getItAssetProfile, updateItAssetProfile, deleteItAssetProfile };
