const AssetCategory = require('../models/asset_categories');

async function createAssetCategory(req, res) {
  try {
    const { code, name, parent_category_id, financial_config, tracking_config, requirements, default_uom_id, id_format, schema_version, active } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: 'code and name are required' });
    }

    const assetCategory = await AssetCategory.create({
      org_id: req.orgId,
      code,
      name,
      parent_category_id: parent_category_id || null,
      financial_config,
      tracking_config,
      requirements,
      default_uom_id: default_uom_id || null,
      id_format,
      schema_version,
      active,
    });

    res.status(201).json(assetCategory);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An asset category with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listAssetCategories(req, res) {
  try {
    const assetCategories = await AssetCategory.find({ org_id: req.orgId }).sort({ name: 1 });
    res.json(assetCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAssetCategory(req, res) {
  try {
    const assetCategory = await AssetCategory.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!assetCategory) {
      return res.status(404).json({ error: 'Asset category not found' });
    }
    res.json(assetCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAssetCategory(req, res) {
  try {
    const { code, name, parent_category_id, financial_config, tracking_config, requirements, default_uom_id, id_format, schema_version, active } = req.body;

    const assetCategory = await AssetCategory.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { code, name, parent_category_id, financial_config, tracking_config, requirements, default_uom_id, id_format, schema_version, active },
      { new: true, runValidators: true }
    );

    if (!assetCategory) {
      return res.status(404).json({ error: 'Asset category not found' });
    }

    res.json(assetCategory);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An asset category with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function deleteAssetCategory(req, res) {
  try {
    const assetCategory = await AssetCategory.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!assetCategory) {
      return res.status(404).json({ error: 'Asset category not found' });
    }
    res.json({ message: 'Asset category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAssetCategory, listAssetCategories, getAssetCategory, updateAssetCategory, deleteAssetCategory };
