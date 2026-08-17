const VerificationRecord = require('../models/verification_records');
const AuditPlan = require('../models/audit_plans');
const Asset = require('../models/assets');

async function createVerificationRecord(req, res) {
  try {
    const { audit_id, asset_id, expected_state, actual_state, result, remarks } = req.body;

    if (!audit_id || !asset_id) {
      return res.status(400).json({ error: 'audit_id and asset_id are required' });
    }

    const [audit, asset] = await Promise.all([
      AuditPlan.findOne({ _id: audit_id, org_id: req.orgId }),
      Asset.findOne({ _id: asset_id, org_id: req.orgId }),
    ]);

    if (!audit) {
      return res.status(400).json({ error: 'audit_id does not belong to your organization' });
    }
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const record = await VerificationRecord.create({
      org_id: req.orgId,
      audit_id,
      asset_id,
      expected_state,
      actual_state,
      result,
      verified_by_id: req.userId,
      remarks,
    });

    res.status(201).json(record);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This asset has already been verified for this audit' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listVerificationRecords(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.audit_id) filter.audit_id = req.query.audit_id;
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const records = await VerificationRecord.find(filter);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getVerificationRecord(req, res) {
  try {
    const record = await VerificationRecord.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!record) {
      return res.status(404).json({ error: 'Verification record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createVerificationRecord, listVerificationRecords, getVerificationRecord };
