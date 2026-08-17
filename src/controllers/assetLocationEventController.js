const AssetLocationEvent = require('../models/asset_location_events');
const Asset = require('../models/assets');
const Location = require('../models/locations');

async function createLocationEvent(req, res) {
  try {
    const { asset_id, to_location_id, reason } = req.body;

    if (!asset_id || !to_location_id) {
      return res.status(400).json({ error: 'asset_id and to_location_id are required' });
    }

    const [asset, toLocation] = await Promise.all([
      Asset.findOne({ _id: asset_id, org_id: req.orgId }),
      Location.findOne({ _id: to_location_id, org_id: req.orgId }),
    ]);

    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }
    if (!toLocation) {
      return res.status(400).json({ error: 'to_location_id does not belong to your organization' });
    }

    const lastEvent = await AssetLocationEvent.findOne({ asset_id }).sort({ moved_at: -1 });
    const from_location_id = lastEvent ? lastEvent.to_location_id : null;

    const event = await AssetLocationEvent.create({
      org_id: req.orgId,
      asset_id,
      from_location_id,
      to_location_id,
      moved_by: req.userId,
      reason,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listLocationEvents(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;

    const events = await AssetLocationEvent.find(filter).sort({ moved_at: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLocationEvent(req, res) {
  try {
    const event = await AssetLocationEvent.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!event) {
      return res.status(404).json({ error: 'Location event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createLocationEvent, listLocationEvents, getLocationEvent };
