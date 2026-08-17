const OutboxEvent = require('../models/outbox_events');

async function listOutboxEvents(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.aggregate_type) filter.aggregate_type = req.query.aggregate_type;
    const events = await OutboxEvent.find(filter).sort({ created_at: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getOutboxEvent(req, res) {
  try {
    const event = await OutboxEvent.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!event) {
      return res.status(404).json({ error: 'Outbox event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { listOutboxEvents, getOutboxEvent };
