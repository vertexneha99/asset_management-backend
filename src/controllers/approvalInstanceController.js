const ApprovalInstance = require('../models/approval_instances');
const ApprovalTemplate = require('../models/approval_templates');

async function createInstance(req, res) {
  try {
    const { approvable_type, approvable_id, template_id, routing_context } = req.body;

    if (!approvable_type || !approvable_id || !template_id) {
      return res.status(400).json({ error: 'approvable_type, approvable_id, and template_id are required' });
    }

    const template = await ApprovalTemplate.findOne({ _id: template_id, org_id: req.orgId });
    if (!template) {
      return res.status(400).json({ error: 'template_id does not belong to your organization' });
    }

    const instance = await ApprovalInstance.create({
      org_id: req.orgId,
      approvable_type,
      approvable_id,
      template_id,
      template_version: template.version,
      requester_id: req.userId,
      routing_context,
    });

    res.status(201).json(instance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listInstances(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.approvable_type) filter.approvable_type = req.query.approvable_type;
    if (req.query.approvable_id) filter.approvable_id = req.query.approvable_id;
    if (req.query.status) filter.status = req.query.status;
    const instances = await ApprovalInstance.find(filter).sort({ created_at: -1 });
    res.json(instances);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getInstance(req, res) {
  try {
    const instance = await ApprovalInstance.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!instance) {
      return res.status(404).json({ error: 'Approval instance not found' });
    }
    res.json(instance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function submitInstance(req, res) {
  try {
    const instance = await ApprovalInstance.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'DRAFT' },
      { status: 'PENDING', current_stage: 1 },
      { new: true, runValidators: true }
    );

    if (!instance) {
      return res.status(404).json({ error: 'Draft approval instance not found' });
    }

    res.json(instance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createInstance, listInstances, getInstance, submitInstance };
