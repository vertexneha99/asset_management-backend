const MaintenanceRequest = require('../models/maintenance_requests');
const Asset = require('../models/assets');

async function createMaintenanceRequest(req, res) {
  try {
    const { asset_id, issue, description, priority, assigned_to_id } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const request = await MaintenanceRequest.create({
      org_id: req.orgId,
      asset_id,
      issue,
      description,
      priority,
      reported_by_id: req.userId,
      assigned_to_id,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listMaintenanceRequests(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;
    const requests = await MaintenanceRequest.find(filter).sort({ request_date: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMaintenanceRequest(req, res) {
  try {
    const request = await MaintenanceRequest.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMaintenanceRequest(req, res) {
  try {
    const { issue, description, priority, assigned_to_id, status, work_order_id } = req.body;

    const request = await MaintenanceRequest.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { issue, description, priority, assigned_to_id, status, work_order_id },
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteMaintenanceRequest(req, res) {
  try {
    const request = await MaintenanceRequest.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!request) {
      return res.status(404).json({ error: 'Maintenance request not found' });
    }
    res.json({ message: 'Maintenance request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createMaintenanceRequest, listMaintenanceRequests, getMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest };
