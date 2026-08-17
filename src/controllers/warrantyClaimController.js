const WarrantyClaim = require('../models/warranty_claims');
const Warranty = require('../models/warranties');

async function createWarrantyClaim(req, res) {
  try {
    const { asset_id, warranty_id, issue, claim_amount } = req.body;

    if (!asset_id || !warranty_id) {
      return res.status(400).json({ error: 'asset_id and warranty_id are required' });
    }

    const warranty = await Warranty.findOne({ _id: warranty_id, org_id: req.orgId, asset_id });
    if (!warranty) {
      return res.status(400).json({ error: 'warranty_id does not belong to your organization or does not match asset_id' });
    }

    const claim = await WarrantyClaim.create({
      org_id: req.orgId,
      asset_id,
      warranty_id,
      issue,
      claim_amount,
      raised_by_id: req.userId,
    });

    res.status(201).json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listWarrantyClaims(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.warranty_id) filter.warranty_id = req.query.warranty_id;
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;
    const claims = await WarrantyClaim.find(filter).sort({ claim_date: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getWarrantyClaim(req, res) {
  try {
    const claim = await WarrantyClaim.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!claim) {
      return res.status(404).json({ error: 'Warranty claim not found' });
    }
    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateWarrantyClaim(req, res) {
  try {
    const { issue, status, claim_amount, resolution_date, remarks } = req.body;

    const claim = await WarrantyClaim.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { issue, status, claim_amount, resolution_date, remarks },
      { new: true, runValidators: true }
    );

    if (!claim) {
      return res.status(404).json({ error: 'Warranty claim not found' });
    }

    res.json(claim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteWarrantyClaim(req, res) {
  try {
    const claim = await WarrantyClaim.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!claim) {
      return res.status(404).json({ error: 'Warranty claim not found' });
    }
    res.json({ message: 'Warranty claim deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createWarrantyClaim, listWarrantyClaims, getWarrantyClaim, updateWarrantyClaim, deleteWarrantyClaim };
