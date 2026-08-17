const ApprovedSoftwarePolicy = require('../models/approved_software_policies');
const SoftwareCatalog = require('../models/software_catalog');

async function createPolicy(req, res) {
  try {
    const { software_id, approved_versions, license_required, allowed_role_ids, max_installations, notes } = req.body;

    if (!software_id) {
      return res.status(400).json({ error: 'software_id is required' });
    }

    const software = await SoftwareCatalog.findOne({ _id: software_id, org_id: req.orgId });
    if (!software) {
      return res.status(400).json({ error: 'software_id does not belong to your organization' });
    }

    const policy = await ApprovedSoftwarePolicy.create({
      org_id: req.orgId,
      software_id,
      approved_versions,
      license_required,
      allowed_role_ids,
      max_installations,
      notes,
    });

    res.status(201).json(policy);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A policy already exists for this software' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listPolicies(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.software_id) filter.software_id = req.query.software_id;
    if (req.query.approval_status) filter.approval_status = req.query.approval_status;
    const policies = await ApprovedSoftwarePolicy.find(filter);
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPolicy(req, res) {
  try {
    const policy = await ApprovedSoftwarePolicy.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePolicy(req, res) {
  try {
    const { approved_versions, approval_status, license_required, allowed_role_ids, max_installations, notes } = req.body;

    const update = { approved_versions, license_required, allowed_role_ids, max_installations, notes };
    if (approval_status) {
      update.approval_status = approval_status;
      update.approved_by = req.userId;
      update.approval_date = new Date();
    }

    const policy = await ApprovedSoftwarePolicy.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      update,
      { new: true, runValidators: true }
    );

    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletePolicy(req, res) {
  try {
    const policy = await ApprovedSoftwarePolicy.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    res.json({ message: 'Policy deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPolicy, listPolicies, getPolicy, updatePolicy, deletePolicy };
