const AuditPlan = require('../models/audit_plans');

async function createAuditPlan(req, res) {
  try {
    const { name, type, department_id, location_id, category_id, start_date, end_date } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const auditPlan = await AuditPlan.create({
      org_id: req.orgId,
      name,
      type,
      department_id,
      location_id,
      category_id,
      auditor_id: req.userId,
      start_date,
      end_date,
    });

    res.status(201).json(auditPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listAuditPlans(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.status) filter.status = req.query.status;
    const auditPlans = await AuditPlan.find(filter);
    res.json(auditPlans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAuditPlan(req, res) {
  try {
    const auditPlan = await AuditPlan.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!auditPlan) {
      return res.status(404).json({ error: 'Audit plan not found' });
    }
    res.json(auditPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAuditPlan(req, res) {
  try {
    const { name, type, start_date, end_date, status, counters } = req.body;

    const auditPlan = await AuditPlan.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { name, type, start_date, end_date, status, counters },
      { new: true, runValidators: true }
    );

    if (!auditPlan) {
      return res.status(404).json({ error: 'Audit plan not found' });
    }

    res.json(auditPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAuditPlan(req, res) {
  try {
    const auditPlan = await AuditPlan.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!auditPlan) {
      return res.status(404).json({ error: 'Audit plan not found' });
    }
    res.json({ message: 'Audit plan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAuditPlan, listAuditPlans, getAuditPlan, updateAuditPlan, deleteAuditPlan };
