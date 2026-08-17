const Vendor = require('../models/vendors');

async function createVendor(req, res) {
  try {
    const { name, contact_person, email, phone, gst_number, bank_details_encrypted, categories_supplied, rating, address, status, onboarded_on } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const vendor = await Vendor.create({
      org_id: req.orgId,
      name,
      contact_person,
      email,
      phone,
      gst_number,
      bank_details_encrypted,
      categories_supplied,
      rating,
      address,
      status,
      onboarded_on,
    });

    res.status(201).json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listVendors(req, res) {
  try {
    const vendors = await Vendor.find({ org_id: req.orgId, deleted_at: null }).sort({ name: 1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getVendor(req, res) {
  try {
    const vendor = await Vendor.findOne({ _id: req.params.id, org_id: req.orgId, deleted_at: null });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateVendor(req, res) {
  try {
    const { name, contact_person, email, phone, gst_number, bank_details_encrypted, categories_supplied, rating, blacklisted, blacklist_reason, address, status, onboarded_on } = req.body;

    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, deleted_at: null },
      { name, contact_person, email, phone, gst_number, bank_details_encrypted, categories_supplied, rating, blacklisted, blacklist_reason, address, status, onboarded_on },
      { new: true, runValidators: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteVendor(req, res) {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, deleted_at: null },
      { deleted_at: new Date(), status: 'inactive' },
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createVendor, listVendors, getVendor, updateVendor, deleteVendor };
