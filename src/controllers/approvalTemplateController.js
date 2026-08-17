const ApprovalTemplate = require('../models/approval_templates');

async function createTemplate(req, res) {
  try {
    const { name, applicable_entity_types, department_scope, asset_category_scope, conditions, mandatory_rules, steps } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const template = await ApprovalTemplate.create({
      org_id: req.orgId,
      name,
      applicable_entity_types,
      department_scope,
      asset_category_scope,
      conditions,
      mandatory_rules,
      steps,
      created_by: req.userId,
    });

    res.status(201).json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listTemplates(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.active !== undefined) filter.active = req.query.active === 'true';
    const templates = await ApprovalTemplate.find(filter);
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTemplate(req, res) {
  try {
    const template = await ApprovalTemplate.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!template) {
      return res.status(404).json({ error: 'Approval template not found' });
    }
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateTemplate(req, res) {
  try {
    const { name, applicable_entity_types, department_scope, asset_category_scope, conditions, mandatory_rules, steps, active, version } = req.body;

    const template = await ApprovalTemplate.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { name, applicable_entity_types, department_scope, asset_category_scope, conditions, mandatory_rules, steps, active, version },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ error: 'Approval template not found' });
    }

    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteTemplate(req, res) {
  try {
    const template = await ApprovalTemplate.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!template) {
      return res.status(404).json({ error: 'Approval template not found' });
    }
    res.json({ message: 'Approval template deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createTemplate, listTemplates, getTemplate, updateTemplate, deleteTemplate };
