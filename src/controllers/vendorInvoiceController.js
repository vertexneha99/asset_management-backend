const VendorInvoice = require('../models/vendor_invoices');
const Vendor = require('../models/vendors');
const PurchaseOrder = require('../models/purchase_orders');

async function createVendorInvoice(req, res) {
  try {
    const { invoice_number, vendor_id, purchase_order_id, due_date, items, totals, remarks } = req.body;

    if (!invoice_number || !vendor_id) {
      return res.status(400).json({ error: 'invoice_number and vendor_id are required' });
    }

    const vendor = await Vendor.findOne({ _id: vendor_id, org_id: req.orgId, deleted_at: null });
    if (!vendor) {
      return res.status(400).json({ error: 'vendor_id does not belong to your organization' });
    }

    if (purchase_order_id) {
      const po = await PurchaseOrder.findOne({ _id: purchase_order_id, org_id: req.orgId });
      if (!po) {
        return res.status(400).json({ error: 'purchase_order_id does not belong to your organization' });
      }
    }

    const vendorInvoice = await VendorInvoice.create({
      org_id: req.orgId,
      invoice_number,
      vendor_id,
      purchase_order_id,
      due_date,
      items,
      totals,
      remarks,
    });

    res.status(201).json(vendorInvoice);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An invoice with this invoice_number already exists for this vendor' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listVendorInvoices(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.vendor_id) filter.vendor_id = req.query.vendor_id;
    if (req.query.payment_status) filter.payment_status = req.query.payment_status;

    const vendorInvoices = await VendorInvoice.find(filter).sort({ invoice_date: -1 });
    res.json(vendorInvoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getVendorInvoice(req, res) {
  try {
    const vendorInvoice = await VendorInvoice.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!vendorInvoice) {
      return res.status(404).json({ error: 'Vendor invoice not found' });
    }
    res.json(vendorInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateVendorInvoice(req, res) {
  try {
    const { due_date, items, totals, remarks } = req.body;

    const vendorInvoice = await VendorInvoice.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, payment_status: { $ne: 'paid' } },
      { due_date, items, totals, remarks },
      { new: true, runValidators: true }
    );

    if (!vendorInvoice) {
      return res.status(404).json({ error: 'Unpaid vendor invoice not found' });
    }

    res.json(vendorInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function payVendorInvoice(req, res) {
  try {
    const { payment_mode } = req.body;

    const vendorInvoice = await VendorInvoice.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, payment_status: { $ne: 'paid' } },
      { payment_status: 'paid', paid_date: new Date(), payment_mode },
      { new: true, runValidators: true }
    );

    if (!vendorInvoice) {
      return res.status(404).json({ error: 'Unpaid vendor invoice not found' });
    }

    res.json(vendorInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteVendorInvoice(req, res) {
  try {
    const vendorInvoice = await VendorInvoice.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!vendorInvoice) {
      return res.status(404).json({ error: 'Vendor invoice not found' });
    }
    res.json({ message: 'Vendor invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createVendorInvoice, listVendorInvoices, getVendorInvoice, updateVendorInvoice, payVendorInvoice, deleteVendorInvoice };
