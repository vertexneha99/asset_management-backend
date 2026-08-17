const UnitOfMeasure = require('../models/units_of_measure');

async function createUnitOfMeasure(req, res) {
  try {
    const { code, name, category, description, is_standard } = req.body;

    if (!code || !name) {
      return res.status(400).json({ error: 'code and name are required' });
    }

    const unitOfMeasure = await UnitOfMeasure.create({
      org_id: req.orgId,
      code,
      name,
      category,
      description,
      is_standard,
    });

    res.status(201).json(unitOfMeasure);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A unit of measure with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listUnitsOfMeasure(req, res) {
  try {
    const unitsOfMeasure = await UnitOfMeasure.find({ org_id: req.orgId }).sort({ name: 1 });
    res.json(unitsOfMeasure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUnitOfMeasure(req, res) {
  try {
    const unitOfMeasure = await UnitOfMeasure.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!unitOfMeasure) {
      return res.status(404).json({ error: 'Unit of measure not found' });
    }
    res.json(unitOfMeasure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateUnitOfMeasure(req, res) {
  try {
    const { code, name, category, description, is_standard } = req.body;

    const unitOfMeasure = await UnitOfMeasure.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { code, name, category, description, is_standard },
      { new: true, runValidators: true }
    );

    if (!unitOfMeasure) {
      return res.status(404).json({ error: 'Unit of measure not found' });
    }

    res.json(unitOfMeasure);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A unit of measure with this code already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function deleteUnitOfMeasure(req, res) {
  try {
    const unitOfMeasure = await UnitOfMeasure.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!unitOfMeasure) {
      return res.status(404).json({ error: 'Unit of measure not found' });
    }
    res.json({ message: 'Unit of measure deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createUnitOfMeasure, listUnitsOfMeasure, getUnitOfMeasure, updateUnitOfMeasure, deleteUnitOfMeasure };
