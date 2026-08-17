const RolePermission = require('../models/role_permissions');
const Role = require('../models/roles');
const Permission = require('../models/permissions');

async function createRolePermission(req, res) {
  try {
    const { role_id, permission_id } = req.body;

    if (!role_id || !permission_id) {
      return res.status(400).json({ error: 'role_id and permission_id are required' });
    }

    const role = await Role.findOne({ _id: role_id, org_id: req.orgId });
    if (!role) {
      return res.status(400).json({ error: 'role_id does not belong to your organization' });
    }

    const permission = await Permission.findById(permission_id);
    if (!permission) {
      return res.status(400).json({ error: 'permission_id does not exist' });
    }

    const rolePermission = await RolePermission.create({ role_id, permission_id });

    res.status(201).json(rolePermission);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This permission is already attached to this role' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listRolePermissions(req, res) {
  try {
    const { role_id } = req.query;

    if (!role_id) {
      return res.status(400).json({ error: 'role_id query parameter is required' });
    }

    const role = await Role.findOne({ _id: role_id, org_id: req.orgId });
    if (!role) {
      return res.status(400).json({ error: 'role_id does not belong to your organization' });
    }

    const rolePermissions = await RolePermission.find({ role_id }).populate('permission_id');
    res.json(rolePermissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRolePermission(req, res) {
  try {
    const rolePermission = await RolePermission.findById(req.params.id).populate('role_id').populate('permission_id');
    if (!rolePermission || !rolePermission.role_id || rolePermission.role_id.org_id.toString() !== req.orgId.toString()) {
      return res.status(404).json({ error: 'Role permission not found' });
    }
    res.json(rolePermission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteRolePermission(req, res) {
  try {
    const rolePermission = await RolePermission.findById(req.params.id).populate('role_id');
    if (!rolePermission || !rolePermission.role_id || rolePermission.role_id.org_id.toString() !== req.orgId.toString()) {
      return res.status(404).json({ error: 'Role permission not found' });
    }
    await RolePermission.deleteOne({ _id: req.params.id });
    res.json({ message: 'Permission removed from role' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createRolePermission, listRolePermissions, getRolePermission, deleteRolePermission };
