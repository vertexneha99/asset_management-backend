const GoodsReceipt = require('../models/goods_receipts');
const PurchaseOrder = require('../models/purchase_orders');
const Vendor = require('../models/vendors');

async function createGoodsReceipt(req, res) {
  try {
    const { grn_number, purchase_order_id, vendor_id, items, checklist, remarks } = req.body;

    if (!grn_number || !purchase_order_id || !vendor_id) {
      return res.status(400).json({ error: 'grn_number, purchase_order_id, and vendor_id are required' });
    }

    const [purchaseOrder, vendor] = await Promise.all([
      PurchaseOrder.findOne({ _id: purchase_order_id, org_id: req.orgId }),
      Vendor.findOne({ _id: vendor_id, org_id: req.orgId, deleted_at: null }),
    ]);

    if (!purchaseOrder) {
      return res.status(400).json({ error: 'purchase_order_id does not belong to your organization' });
    }
    if (!vendor) {
      return res.status(400).json({ error: 'vendor_id does not belong to your organization' });
    }

    const goodsReceipt = await GoodsReceipt.create({
      org_id: req.orgId,
      grn_number,
      purchase_order_id,
      vendor_id,
      items,
      checklist,
      remarks,
    });

    res.status(201).json(goodsReceipt);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A goods receipt with this grn_number already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listGoodsReceipts(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.purchase_order_id) filter.purchase_order_id = req.query.purchase_order_id;
    if (req.query.vendor_id) filter.vendor_id = req.query.vendor_id;
    if (req.query.inspection_status) filter.inspection_status = req.query.inspection_status;

    const goodsReceipts = await GoodsReceipt.find(filter).sort({ received_date: -1 });
    res.json(goodsReceipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getGoodsReceipt(req, res) {
  try {
    const goodsReceipt = await GoodsReceipt.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!goodsReceipt) {
      return res.status(404).json({ error: 'Goods receipt not found' });
    }
    res.json(goodsReceipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateGoodsReceipt(req, res) {
  try {
    const { inspection_status, items, checklist, remarks } = req.body;

    const update = { items, checklist, remarks };
    if (inspection_status) {
      update.inspection_status = inspection_status;
      update.inspected_by_id = req.userId;
    }

    const goodsReceipt = await GoodsReceipt.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      update,
      { new: true, runValidators: true }
    );

    if (!goodsReceipt) {
      return res.status(404).json({ error: 'Goods receipt not found' });
    }

    res.json(goodsReceipt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteGoodsReceipt(req, res) {
  try {
    const goodsReceipt = await GoodsReceipt.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!goodsReceipt) {
      return res.status(404).json({ error: 'Goods receipt not found' });
    }
    res.json({ message: 'Goods receipt deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createGoodsReceipt, listGoodsReceipts, getGoodsReceipt, updateGoodsReceipt, deleteGoodsReceipt };
