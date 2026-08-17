const Warranty = require('../models/warranties');
const Asset = require('../models/assets');

async function createWarranty(req, res) {
  try {
    const { asset_id, provider, start_date, end_date, coverage, type, contact_number, document_ref } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const warranty = await Warranty.create({
      org_id: req.orgId,
      asset_id,
      provider,
      start_date,
      end_date,
      coverage,
      type,
      contact_number,
      document_ref,
    });

    res.status(201).json(warranty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listWarranties(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;
    const warranties = await Warranty.find(filter);
    res.json(warranties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getWarranty(req, res) {
  try {
    const warranty = await Warranty.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!warranty) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    res.json(warranty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateWarranty(req, res) {
  try {
    const { provider, start_date, end_date, coverage, type, contact_number, document_ref, status } = req.body;

    const warranty = await Warranty.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { provider, start_date, end_date, coverage, type, contact_number, document_ref, status },
      { new: true, runValidators: true }
    );

    if (!warranty) {
      return res.status(404).json({ error: 'Warranty not found' });
    }

    res.json(warranty);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteWarranty(req, res) {
  try {
    const warranty = await Warranty.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!warranty) {
      return res.status(404).json({ error: 'Warranty not found' });
    }
    res.json({ message: 'Warranty deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createWarranty, listWarranties, getWarranty, updateWarranty, deleteWarranty };
