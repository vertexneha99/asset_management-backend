const Incident = require('../models/incidents');

async function createIncident(req, res) {
  try {
    const { asset_id, title, type, severity, location_id, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const incident = await Incident.create({
      org_id: req.orgId,
      asset_id,
      title,
      type,
      reported_by_id: req.userId,
      severity,
      location_id,
      description,
    });

    res.status(201).json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listIncidents(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    const incidents = await Incident.find(filter).sort({ reported_on: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getIncident(req, res) {
  try {
    const incident = await Incident.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateIncident(req, res) {
  try {
    const { title, type, severity, stage, status, assigned_to_id, description, resolution, work_order_id } = req.body;

    const update = { title, type, severity, stage, status, assigned_to_id, description, resolution, work_order_id };
    if (status === 'resolved' || status === 'closed') {
      update.resolved_on = new Date();
    }

    const incident = await Incident.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      update,
      { new: true, runValidators: true }
    );

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteIncident(req, res) {
  try {
    const incident = await Incident.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json({ message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createIncident, listIncidents, getIncident, updateIncident, deleteIncident };
