const AmcAssetLink = require('../models/amc_asset_links');
const AmcContract = require('../models/amc_contracts');
const Asset = require('../models/assets');

async function createAmcAssetLink(req, res) {
  try {
    const { amc_contract_id, asset_id } = req.body;

    if (!amc_contract_id || !asset_id) {
      return res.status(400).json({ error: 'amc_contract_id and asset_id are required' });
    }

    const [contract, asset] = await Promise.all([
      AmcContract.findOne({ _id: amc_contract_id, org_id: req.orgId }),
      Asset.findOne({ _id: asset_id, org_id: req.orgId }),
    ]);

    if (!contract) {
      return res.status(400).json({ error: 'amc_contract_id does not belong to your organization' });
    }
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const link = await AmcAssetLink.create({ org_id: req.orgId, amc_contract_id, asset_id });

    res.status(201).json(link);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This asset is already linked to this AMC contract' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listAmcAssetLinks(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.amc_contract_id) filter.amc_contract_id = req.query.amc_contract_id;
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const links = await AmcAssetLink.find(filter);
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAmcAssetLink(req, res) {
  try {
    const link = await AmcAssetLink.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!link) {
      return res.status(404).json({ error: 'AMC asset link not found' });
    }
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAmcAssetLink(req, res) {
  try {
    const link = await AmcAssetLink.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!link) {
      return res.status(404).json({ error: 'AMC asset link not found' });
    }
    res.json({ message: 'AMC asset link deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAmcAssetLink, listAmcAssetLinks, getAmcAssetLink, deleteAmcAssetLink };
