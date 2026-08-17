const AuditException = require('../models/audit_exceptions');
const AuditPlan = require('../models/audit_plans');
const Asset = require('../models/assets');

async function createAuditException(req, res) {
  try {
    const { audit_id, asset_id, exception_type, severity, details, assigned_to_id } = req.body;

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

    const exception = await AuditException.create({
      org_id: req.orgId,
      audit_id,
      asset_id,
      exception_type,
      severity,
      details,
      assigned_to_id,
    });

    res.status(201).json(exception);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listAuditExceptions(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.audit_id) filter.audit_id = req.query.audit_id;
    if (req.query.status) filter.status = req.query.status;
    const exceptions = await AuditException.find(filter);
    res.json(exceptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAuditException(req, res) {
  try {
    const exception = await AuditException.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!exception) {
      return res.status(404).json({ error: 'Audit exception not found' });
    }
    res.json(exception);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAuditException(req, res) {
  try {
    const { exception_type, severity, details, assigned_to_id, status } = req.body;

    const update = { exception_type, severity, details, assigned_to_id, status };
    if (status === 'resolved') {
      update.resolved_on = new Date();
    }

    const exception = await AuditException.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      update,
      { new: true, runValidators: true }
    );

    if (!exception) {
      return res.status(404).json({ error: 'Audit exception not found' });
    }

    res.json(exception);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAuditException(req, res) {
  try {
    const exception = await AuditException.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!exception) {
      return res.status(404).json({ error: 'Audit exception not found' });
    }
    res.json({ message: 'Audit exception deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAuditException, listAuditExceptions, getAuditException, updateAuditException, deleteAuditException };
