const ServiceRecord = require('../models/service_records');
const Asset = require('../models/assets');

async function createServiceRecord(req, res) {
  try {
    const { asset_id, work_order_id, service_type, cost, downtime_hours, outcome, remarks } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const record = await ServiceRecord.create({
      org_id: req.orgId,
      asset_id,
      work_order_id,
      service_type,
      performed_by_id: req.userId,
      cost,
      downtime_hours,
      outcome,
      remarks,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listServiceRecords(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.work_order_id) filter.work_order_id = req.query.work_order_id;
    const records = await ServiceRecord.find(filter).sort({ service_date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getServiceRecord(req, res) {
  try {
    const record = await ServiceRecord.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!record) {
      return res.status(404).json({ error: 'Service record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateServiceRecord(req, res) {
  try {
    const { service_type, cost, downtime_hours, outcome, remarks } = req.body;

    const record = await ServiceRecord.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { service_type, cost, downtime_hours, outcome, remarks },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ error: 'Service record not found' });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteServiceRecord(req, res) {
  try {
    const record = await ServiceRecord.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!record) {
      return res.status(404).json({ error: 'Service record not found' });
    }
    res.json({ message: 'Service record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createServiceRecord, listServiceRecords, getServiceRecord, updateServiceRecord, deleteServiceRecord };
