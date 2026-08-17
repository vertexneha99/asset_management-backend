const Asset = require('../models/assets');

async function createAsset(req, res) {
  try {
    const {
      asset_tag,
      item_master_id,
      classification,
      identity,
      description,
      lifecycle,
      ownership,
      acquisition,
      warranty_snapshot,
      financial_snapshot,
      insurance_snapshot,
      visibility,
      attributes,
      custom_fields,
      parent_asset_id,
      counts_against_quota,
    } = req.body;

    if (!asset_tag || !item_master_id) {
      return res.status(400).json({ error: 'asset_tag and item_master_id are required' });
    }

    const asset = await Asset.create({
      org_id: req.orgId,
      asset_tag,
      item_master_id,
      classification,
      identity,
      description,
      lifecycle,
      ownership,
      acquisition,
      warranty_snapshot,
      financial_snapshot,
      insurance_snapshot,
      visibility,
      attributes,
      custom_fields,
      parent_asset_id: parent_asset_id || null,
      counts_against_quota,
      created_by: req.userId,
    });

    res.status(201).json(asset);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An asset with this asset_tag already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listAssets(req, res) {
  try {
    const assets = await Asset.find({ org_id: req.orgId }).sort({ created_at: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAsset(req, res) {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAsset(req, res) {
  try {
    const {
      asset_tag,
      item_master_id,
      classification,
      identity,
      description,
      lifecycle,
      ownership,
      acquisition,
      warranty_snapshot,
      financial_snapshot,
      insurance_snapshot,
      visibility,
      attributes,
      custom_fields,
      parent_asset_id,
      counts_against_quota,
    } = req.body;

    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      {
        asset_tag,
        item_master_id,
        classification,
        identity,
        description,
        lifecycle,
        ownership,
        acquisition,
        warranty_snapshot,
        financial_snapshot,
        insurance_snapshot,
        visibility,
        attributes,
        custom_fields,
        parent_asset_id,
        counts_against_quota,
      },
      { new: true, runValidators: true }
    );

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(asset);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An asset with this asset_tag already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function deleteAsset(req, res) {
  try {
    const asset = await Asset.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAsset, listAssets, getAsset, updateAsset, deleteAsset };
