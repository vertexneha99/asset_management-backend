const crypto = require('crypto');
const AuditEvent = require('../models/audit_events');

function computeHash({ entity_type, entity_id, action, before_state, after_state, created_at, prev_hash }) {
  const payload = JSON.stringify({ entity_type, entity_id, action, before_state, after_state, created_at, prev_hash });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

async function createAuditEvent(req, res) {
  try {
    const { entity_type, entity_id, action, before_state, after_state, field_diffs, request_metadata } = req.body;

    if (!entity_type || !entity_id) {
      return res.status(400).json({ error: 'entity_type and entity_id are required' });
    }

    const created_at = new Date();
    const lastEvent = await AuditEvent.findOne({ org_id: req.orgId, entity_type, entity_id }).sort({ created_at: -1 });
    const prev_hash = lastEvent ? lastEvent.hash : null;

    const hash = computeHash({ entity_type, entity_id, action, before_state, after_state, created_at, prev_hash });

    const event = await AuditEvent.create({
      org_id: req.orgId,
      entity_type,
      entity_id,
      action,
      actor_id: req.userId,
      actor_ip: req.ip,
      before_state,
      after_state,
      field_diffs,
      request_metadata,
      prev_hash,
      hash,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listAuditEvents(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.entity_type) filter.entity_type = req.query.entity_type;
    if (req.query.entity_id) filter.entity_id = req.query.entity_id;
    const events = await AuditEvent.find(filter).sort({ created_at: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAuditEvent(req, res) {
  try {
    const event = await AuditEvent.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!event) {
      return res.status(404).json({ error: 'Audit event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAuditEvent, listAuditEvents, getAuditEvent };
