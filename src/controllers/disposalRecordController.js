const DisposalRecord = require('../models/disposal_records');
const Asset = require('../models/assets');

async function createDisposalRecord(req, res) {
  try {
    const { asset_id, disposal_method, disposal_date, disposal_reason, condition_at_disposal, financial_snapshot, recipient, certificates, notes } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const disposalRecord = await DisposalRecord.create({
      org_id: req.orgId,
      asset_id,
      disposal_method,
      disposal_date,
      disposal_reason,
      disposal_initiated_by: req.userId,
      condition_at_disposal,
      financial_snapshot,
      recipient,
      certificates,
      notes,
    });

    res.status(201).json(disposalRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listDisposalRecords(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const disposalRecords = await DisposalRecord.find(filter).sort({ created_at: -1 });
    res.json(disposalRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDisposalRecord(req, res) {
  try {
    const disposalRecord = await DisposalRecord.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!disposalRecord) {
      return res.status(404).json({ error: 'Disposal record not found' });
    }
    res.json(disposalRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function finalizeDisposal(req, res) {
  try {
    const disposalRecord = await DisposalRecord.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { asset_tag_decommissioned: true },
      { new: true, runValidators: true }
    );

    if (!disposalRecord) {
      return res.status(404).json({ error: 'Disposal record not found' });
    }

    await Asset.findOneAndUpdate(
      { _id: disposalRecord.asset_id, org_id: req.orgId },
      { 'lifecycle.status': 'DISPOSED' }
    );

    res.json(disposalRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createDisposalRecord, listDisposalRecords, getDisposalRecord, finalizeDisposal };
