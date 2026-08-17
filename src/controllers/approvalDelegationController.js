const ApprovalDelegation = require('../models/approval_delegations');

async function createDelegation(req, res) {
  try {
    const { original_approver_id, substitute_approver_id, reason, start_date, end_date } = req.body;

    if (!original_approver_id || !substitute_approver_id) {
      return res.status(400).json({ error: 'original_approver_id and substitute_approver_id are required' });
    }

    const delegation = await ApprovalDelegation.create({
      org_id: req.orgId,
      original_approver_id,
      substitute_approver_id,
      reason,
      start_date,
      end_date,
    });

    res.status(201).json(delegation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listDelegations(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.original_approver_id) filter.original_approver_id = req.query.original_approver_id;
    if (req.query.active !== undefined) filter.active = req.query.active === 'true';
    const delegations = await ApprovalDelegation.find(filter);
    res.json(delegations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDelegation(req, res) {
  try {
    const delegation = await ApprovalDelegation.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!delegation) {
      return res.status(404).json({ error: 'Delegation not found' });
    }
    res.json(delegation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateDelegation(req, res) {
  try {
    const { reason, start_date, end_date, active } = req.body;

    const delegation = await ApprovalDelegation.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { reason, start_date, end_date, active },
      { new: true, runValidators: true }
    );

    if (!delegation) {
      return res.status(404).json({ error: 'Delegation not found' });
    }

    res.json(delegation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDelegation(req, res) {
  try {
    const delegation = await ApprovalDelegation.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!delegation) {
      return res.status(404).json({ error: 'Delegation not found' });
    }
    res.json({ message: 'Delegation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createDelegation, listDelegations, getDelegation, updateDelegation, deleteDelegation };
