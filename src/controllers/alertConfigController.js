const AlertConfig = require('../models/alert_configs');

async function createAlertConfig(req, res) {
  try {
    const { alert_type, enabled, threshold, escalation_hours, digest_mode } = req.body;

    if (!alert_type) {
      return res.status(400).json({ error: 'alert_type is required' });
    }

    const alertConfig = await AlertConfig.create({
      org_id: req.orgId,
      alert_type,
      enabled,
      threshold,
      escalation_hours,
      digest_mode,
    });

    res.status(201).json(alertConfig);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A config for this alert_type already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listAlertConfigs(req, res) {
  try {
    const alertConfigs = await AlertConfig.find({ org_id: req.orgId });
    res.json(alertConfigs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAlertConfig(req, res) {
  try {
    const alertConfig = await AlertConfig.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!alertConfig) {
      return res.status(404).json({ error: 'Alert config not found' });
    }
    res.json(alertConfig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAlertConfig(req, res) {
  try {
    const { enabled, threshold, escalation_hours, digest_mode } = req.body;

    const alertConfig = await AlertConfig.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { enabled, threshold, escalation_hours, digest_mode },
      { new: true, runValidators: true }
    );

    if (!alertConfig) {
      return res.status(404).json({ error: 'Alert config not found' });
    }

    res.json(alertConfig);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAlertConfig(req, res) {
  try {
    const alertConfig = await AlertConfig.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!alertConfig) {
      return res.status(404).json({ error: 'Alert config not found' });
    }
    res.json({ message: 'Alert config deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAlertConfig, listAlertConfigs, getAlertConfig, updateAlertConfig, deleteAlertConfig };
