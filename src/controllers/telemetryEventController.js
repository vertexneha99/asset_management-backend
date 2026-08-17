const TelemetryEvent = require('../models/telemetry_events');
const Asset = require('../models/assets');

async function createTelemetryEvent(req, res) {
  try {
    const { asset_id, sensor_type, metrics, source } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const event = await TelemetryEvent.create({
      org_id: req.orgId,
      asset_id,
      sensor_type,
      metrics,
      source,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listTelemetryEvents(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.sensor_type) filter.sensor_type = req.query.sensor_type;
    const events = await TelemetryEvent.find(filter).sort({ timestamp: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTelemetryEvent(req, res) {
  try {
    const event = await TelemetryEvent.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!event) {
      return res.status(404).json({ error: 'Telemetry event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createTelemetryEvent, listTelemetryEvents, getTelemetryEvent };
