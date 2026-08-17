const AssetRequest = require('../models/asset_requests');

async function createAssetRequest(req, res) {
  try {
    const { request_no, request_type, title, department_id, asset_id, item_master_id, quantity, estimated_cost, required_by, priority, justification } = req.body;

    if (!request_no) {
      return res.status(400).json({ error: 'request_no is required' });
    }

    const assetRequest = await AssetRequest.create({
      org_id: req.orgId,
      request_no,
      request_type,
      title,
      requested_by_id: req.userId,
      department_id,
      asset_id,
      item_master_id,
      quantity,
      estimated_cost,
      required_by,
      priority,
      justification,
    });

    res.status(201).json(assetRequest);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An asset request with this request_no already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listAssetRequests(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department_id) filter.department_id = req.query.department_id;
    const requests = await AssetRequest.find(filter).sort({ created_at: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAssetRequest(req, res) {
  try {
    const assetRequest = await AssetRequest.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!assetRequest) {
      return res.status(404).json({ error: 'Asset request not found' });
    }
    res.json(assetRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAssetRequest(req, res) {
  try {
    const { request_type, title, quantity, estimated_cost, required_by, priority, justification, status } = req.body;

    const assetRequest = await AssetRequest.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { request_type, title, quantity, estimated_cost, required_by, priority, justification, status },
      { new: true, runValidators: true }
    );

    if (!assetRequest) {
      return res.status(404).json({ error: 'Asset request not found' });
    }

    res.json(assetRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAssetRequest(req, res) {
  try {
    const assetRequest = await AssetRequest.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!assetRequest) {
      return res.status(404).json({ error: 'Asset request not found' });
    }
    res.json({ message: 'Asset request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAssetRequest, listAssetRequests, getAssetRequest, updateAssetRequest, deleteAssetRequest };
