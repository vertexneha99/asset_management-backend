const FilterPreset = require('../models/filter_presets');

async function createFilterPreset(req, res) {
  try {
    const { name, module: moduleName, filter_group, is_default } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const preset = await FilterPreset.create({
      org_id: req.orgId,
      owner_id: req.userId,
      name,
      module: moduleName,
      filter_group,
      is_default,
    });

    res.status(201).json(preset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listFilterPresets(req, res) {
  try {
    const filter = { org_id: req.orgId, owner_id: req.userId };
    if (req.query.module) filter.module = req.query.module;
    const presets = await FilterPreset.find(filter);
    res.json(presets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFilterPreset(req, res) {
  try {
    const preset = await FilterPreset.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!preset) {
      return res.status(404).json({ error: 'Filter preset not found' });
    }
    res.json(preset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateFilterPreset(req, res) {
  try {
    const { name, filter_group, is_default } = req.body;

    const preset = await FilterPreset.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, owner_id: req.userId },
      { name, filter_group, is_default },
      { new: true, runValidators: true }
    );

    if (!preset) {
      return res.status(404).json({ error: 'Filter preset not found' });
    }

    res.json(preset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteFilterPreset(req, res) {
  try {
    const preset = await FilterPreset.findOneAndDelete({ _id: req.params.id, org_id: req.orgId, owner_id: req.userId });
    if (!preset) {
      return res.status(404).json({ error: 'Filter preset not found' });
    }
    res.json({ message: 'Filter preset deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createFilterPreset, listFilterPresets, getFilterPreset, updateFilterPreset, deleteFilterPreset };
