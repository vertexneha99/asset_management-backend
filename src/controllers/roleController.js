const Role = require('../models/roles');

async function createRole(req, res) {
  try {
    const { code, name, is_system_role, department_scoped } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: 'code and name are required' });
    }

    const role = await Role.create({
      org_id: req.orgId,
      code,
      name,
      is_system_role,
      department_scoped,
    });

    res.status(201).json(role);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A role with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listRoles(req, res) {
  try {
    const roles = await Role.find({ org_id: req.orgId }).sort({ name: 1 });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRole(req, res) {
  try {
    const role = await Role.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateRole(req, res) {
  try {
    const { code, name, is_system_role, department_scoped } = req.body;

    const role = await Role.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { code, name, is_system_role, department_scoped },
      { new: true, runValidators: true }
    );

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json(role);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A role with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function deleteRole(req, res) {
  try {
    const role = await Role.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createRole, listRoles, getRole, updateRole, deleteRole };
