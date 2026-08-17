const PurchaseOrder = require('../models/purchase_orders');
const Vendor = require('../models/vendors');
const PurchaseRequest = require('../models/purchase_requests');

async function createPurchaseOrder(req, res) {
  try {
    const { po_number, vendor_id, linked_request_id, expected_delivery, items, totals, payment_terms, warranty_terms, amc_terms } = req.body;

    if (!po_number || !vendor_id) {
      return res.status(400).json({ error: 'po_number and vendor_id are required' });
    }

    const vendor = await Vendor.findOne({ _id: vendor_id, org_id: req.orgId, deleted_at: null });
    if (!vendor) {
      return res.status(400).json({ error: 'vendor_id does not belong to your organization' });
    }

    if (linked_request_id) {
      const request = await PurchaseRequest.findOne({ _id: linked_request_id, org_id: req.orgId });
      if (!request) {
        return res.status(400).json({ error: 'linked_request_id does not belong to your organization' });
      }
    }

    const purchaseOrder = await PurchaseOrder.create({
      org_id: req.orgId,
      po_number,
      vendor_id,
      linked_request_id,
      expected_delivery,
      items,
      totals,
      payment_terms,
      warranty_terms,
      amc_terms,
    });

    res.status(201).json(purchaseOrder);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A purchase order with this po_number already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listPurchaseOrders(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.vendor_id) filter.vendor_id = req.query.vendor_id;
    if (req.query.payment_status) filter.payment_status = req.query.payment_status;
    if (req.query.delivery_status) filter.delivery_status = req.query.delivery_status;

    const purchaseOrders = await PurchaseOrder.find(filter).sort({ order_date: -1 });
    res.json(purchaseOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPurchaseOrder(req, res) {
  try {
    const purchaseOrder = await PurchaseOrder.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json(purchaseOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePurchaseOrder(req, res) {
  try {
    const { expected_delivery, items, totals, payment_terms, payment_status, delivery_status, warranty_terms, amc_terms } = req.body;

    const purchaseOrder = await PurchaseOrder.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { expected_delivery, items, totals, payment_terms, payment_status, delivery_status, warranty_terms, amc_terms },
      { new: true, runValidators: true }
    );

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json(purchaseOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletePurchaseOrder(req, res) {
  try {
    const purchaseOrder = await PurchaseOrder.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    res.json({ message: 'Purchase order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPurchaseOrder, listPurchaseOrders, getPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder };
