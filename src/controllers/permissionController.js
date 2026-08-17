const Permission = require('../models/permissions');

async function listPermissions(req, res) {
  try {
    const permissions = await Permission.find({}).sort({ module: 1, action: 1 });
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPermission(req, res) {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listPermissions, getPermission };
