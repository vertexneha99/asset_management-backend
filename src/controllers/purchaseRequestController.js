const PurchaseRequest = require('../models/purchase_requests');
const Department = require('../models/departments');

async function createPurchaseRequest(req, res) {
  try {
    const { request_no, department_id, priority, required_date, estimated_cost, currency, justification, items } = req.body;

    if (!request_no) {
      return res.status(400).json({ error: 'request_no is required' });
    }

    if (department_id) {
      const department = await Department.findOne({ _id: department_id, org_id: req.orgId });
      if (!department) {
        return res.status(400).json({ error: 'department_id does not belong to your organization' });
      }
    }

    const purchaseRequest = await PurchaseRequest.create({
      org_id: req.orgId,
      request_no,
      requested_by_id: req.userId,
      department_id,
      priority,
      required_date,
      estimated_cost,
      currency,
      justification,
      items,
      status: 'draft',
    });

    res.status(201).json(purchaseRequest);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A purchase request with this request_no already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listPurchaseRequests(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.department_id) filter.department_id = req.query.department_id;

    const requests = await PurchaseRequest.find(filter).sort({ raised_on: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPurchaseRequest(req, res) {
  try {
    const purchaseRequest = await PurchaseRequest.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!purchaseRequest) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }
    res.json(purchaseRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePurchaseRequest(req, res) {
  try {
    const { priority, required_date, estimated_cost, currency, justification, items, status } = req.body;

    const purchaseRequest = await PurchaseRequest.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { priority, required_date, estimated_cost, currency, justification, items, status },
      { new: true, runValidators: true }
    );

    if (!purchaseRequest) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }

    res.json(purchaseRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletePurchaseRequest(req, res) {
  try {
    const purchaseRequest = await PurchaseRequest.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!purchaseRequest) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }
    res.json({ message: 'Purchase request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPurchaseRequest, listPurchaseRequests, getPurchaseRequest, updatePurchaseRequest, deletePurchaseRequest };
