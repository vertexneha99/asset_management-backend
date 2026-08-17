const SoftwareCatalog = require('../models/software_catalog');

async function createSoftware(req, res) {
  try {
    const { software_name, publisher, category, licensing_model, supported_versions, eol_date, compliance_notes } = req.body;

    if (!software_name) {
      return res.status(400).json({ error: 'software_name is required' });
    }

    const software = await SoftwareCatalog.create({
      org_id: req.orgId,
      software_name,
      publisher,
      category,
      licensing_model,
      supported_versions,
      eol_date,
      compliance_notes,
    });

    res.status(201).json(software);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This software already exists in your catalog' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listSoftware(req, res) {
  try {
    const software = await SoftwareCatalog.find({ org_id: req.orgId });
    res.json(software);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getSoftware(req, res) {
  try {
    const software = await SoftwareCatalog.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!software) {
      return res.status(404).json({ error: 'Software not found' });
    }
    res.json(software);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateSoftware(req, res) {
  try {
    const { publisher, category, licensing_model, supported_versions, eol_date, compliance_notes } = req.body;

    const software = await SoftwareCatalog.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { publisher, category, licensing_model, supported_versions, eol_date, compliance_notes },
      { new: true, runValidators: true }
    );

    if (!software) {
      return res.status(404).json({ error: 'Software not found' });
    }

    res.json(software);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteSoftware(req, res) {
  try {
    const software = await SoftwareCatalog.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!software) {
      return res.status(404).json({ error: 'Software not found' });
    }
    res.json({ message: 'Software deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createSoftware, listSoftware, getSoftware, updateSoftware, deleteSoftware };
