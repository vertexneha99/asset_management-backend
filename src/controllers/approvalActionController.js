const ApprovalAction = require('../models/approval_actions');
const ApprovalInstance = require('../models/approval_instances');

async function createAction(req, res) {
  try {
    const { approval_instance_id, action, comment, original_approver_id, delegated_from_user_id } = req.body;

    if (!approval_instance_id || !action) {
      return res.status(400).json({ error: 'approval_instance_id and action are required' });
    }

    const instance = await ApprovalInstance.findOne({ _id: approval_instance_id, org_id: req.orgId });
    if (!instance) {
      return res.status(400).json({ error: 'approval_instance_id does not belong to your organization' });
    }
    if (instance.status !== 'PENDING') {
      return res.status(409).json({ error: 'This approval instance is not pending action' });
    }

    const approvalAction = await ApprovalAction.create({
      org_id: req.orgId,
      approval_instance_id,
      stage: instance.current_stage,
      original_approver_id,
      acted_by_id: req.userId,
      action,
      delegated_from_user_id,
      comment,
    });

    if (action === 'REJECTED') {
      instance.status = 'REJECTED';
      instance.completed_at = new Date();
    } else if (action === 'APPROVED') {
      instance.status = 'APPROVED';
      instance.completed_at = new Date();
    } else if (action === 'SENT_BACK') {
      instance.status = 'SENT_BACK';
    }
    instance.resolved_steps = [...(instance.resolved_steps || []), { stage: approvalAction.stage, action, acted_by_id: req.userId }];
    await instance.save();

    res.status(201).json(approvalAction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listActions(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.approval_instance_id) filter.approval_instance_id = req.query.approval_instance_id;
    const actions = await ApprovalAction.find(filter).sort({ acted_on: 1 });
    res.json(actions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAction(req, res) {
  try {
    const action = await ApprovalAction.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!action) {
      return res.status(404).json({ error: 'Approval action not found' });
    }
    res.json(action);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAction, listActions, getAction };
