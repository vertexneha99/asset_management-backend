const Location = require('../models/locations');

async function computeAncestors(parentId) {
  if (!parentId) return [];
  const parent = await Location.findById(parentId);
  if (!parent) return [];
  return [...(parent.ancestors || []), parent._id];
}

async function createLocation(req, res) {
  try {
    const { type, code, name, parent_id, address, geo, capacity, responsible_employee_id, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const ancestors = await computeAncestors(parent_id);

    const location = await Location.create({
      org_id: req.orgId,
      type,
      code,
      name,
      parent_id: parent_id || null,
      ancestors,
      address,
      geo,
      capacity,
      responsible_employee_id: responsible_employee_id || null,
      status,
    });

    res.status(201).json(location);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A location with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listLocations(req, res) {
  try {
    const locations = await Location.find({ org_id: req.orgId }).sort({ name: 1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLocation(req, res) {
  try {
    const location = await Location.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateLocation(req, res) {
  try {
    const { type, code, name, parent_id, address, geo, capacity, responsible_employee_id, status } = req.body;

    const update = { type, code, name, parent_id, address, geo, capacity, responsible_employee_id, status };

    if (parent_id !== undefined) {
      update.ancestors = await computeAncestors(parent_id);
    }

    const location = await Location.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      update,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(location);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A location with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function deleteLocation(req, res) {
  try {
    const location = await Location.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createLocation, listLocations, getLocation, updateLocation, deleteLocation };
