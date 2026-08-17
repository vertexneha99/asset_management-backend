const crypto = require('crypto');
const AssetLifecycleEvent = require('../models/asset_lifecycle_events');
const Asset = require('../models/assets');

function computeHash({ asset_id, event_type, from_state, to_state, event_date, prev_hash }) {
  const payload = JSON.stringify({ asset_id, event_type, from_state, to_state, event_date, prev_hash });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

async function createLifecycleEvent(req, res) {
  try {
    const { asset_id, event_type, to_state, performed_by, approved_by, event_source, metadata, attachment_refs, financial_impact } = req.body;

    if (!asset_id || !event_type || !to_state) {
      return res.status(400).json({ error: 'asset_id, event_type, and to_state are required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const from_state = (asset.lifecycle && asset.lifecycle.status) || null;
    const event_date = new Date();

    const lastEvent = await AssetLifecycleEvent.findOne({ asset_id }).sort({ created_at: -1 });
    const prev_hash = lastEvent ? lastEvent.hash : null;

    const hash = computeHash({ asset_id, event_type, from_state, to_state, event_date, prev_hash });

    const event = await AssetLifecycleEvent.create({
      org_id: req.orgId,
      asset_id,
      event_type,
      from_state,
      to_state,
      event_date,
      performed_by: performed_by || req.userId,
      approved_by,
      event_source: event_source || 'api',
      metadata,
      attachment_refs,
      financial_impact,
      prev_hash,
      hash,
    });

    asset.lifecycle = { ...(asset.lifecycle || {}), status: to_state };
    await asset.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listLifecycleEvents(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) {
      filter.asset_id = req.query.asset_id;
    }
    const events = await AssetLifecycleEvent.find(filter).sort({ event_date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLifecycleEvent(req, res) {
  try {
    const event = await AssetLifecycleEvent.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!event) {
      return res.status(404).json({ error: 'Lifecycle event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createLifecycleEvent, listLifecycleEvents, getLifecycleEvent };
