const UserRole = require('../models/user_roles');
const User = require('../models/users');
const Role = require('../models/roles');

async function createUserRole(req, res) {
  try {
    const { user_id, role_id, department_id } = req.body;

    if (!user_id || !role_id) {
      return res.status(400).json({ error: 'user_id and role_id are required' });
    }

    const [user, role] = await Promise.all([
      User.findOne({ _id: user_id, org_id: req.orgId }),
      Role.findOne({ _id: role_id, org_id: req.orgId }),
    ]);

    if (!user) {
      return res.status(400).json({ error: 'user_id does not belong to your organization' });
    }
    if (!role) {
      return res.status(400).json({ error: 'role_id does not belong to your organization' });
    }

    const userRole = await UserRole.create({
      org_id: req.orgId,
      user_id,
      role_id,
      department_id: department_id || null,
    });

    res.status(201).json(userRole);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This role is already assigned to this user for this department scope' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listUserRoles(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.user_id) {
      filter.user_id = req.query.user_id;
    }
    const userRoles = await UserRole.find(filter)
      .populate('role_id')
      .populate('user_id', 'email')
      .sort({ assigned_at: -1 });
    res.json(userRoles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUserRole(req, res) {
  try {
    const userRole = await UserRole.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!userRole) {
      return res.status(404).json({ error: 'User role assignment not found' });
    }
    res.json(userRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const { department_id } = req.body;

    const userRole = await UserRole.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { department_id: department_id || null },
      { new: true, runValidators: true }
    );

    if (!userRole) {
      return res.status(404).json({ error: 'User role assignment not found' });
    }

    res.json(userRole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteUserRole(req, res) {
  try {
    const userRole = await UserRole.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!userRole) {
      return res.status(404).json({ error: 'User role assignment not found' });
    }
    res.json({ message: 'Role assignment revoked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createUserRole, listUserRoles, getUserRole, updateUserRole, deleteUserRole };
