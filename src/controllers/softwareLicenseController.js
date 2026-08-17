const SoftwareLicense = require('../models/software_licenses');
const SoftwareCatalog = require('../models/software_catalog');

async function createLicense(req, res) {
  try {
    const { software_id, license_type, procurement_id, license_key_encrypted, total_seats, effective_date, expiry_date, renewal_reminder_days, auto_renew, annual_cost, next_renewal_amount, budget_code } = req.body;

    if (!software_id) {
      return res.status(400).json({ error: 'software_id is required' });
    }

    const software = await SoftwareCatalog.findOne({ _id: software_id, org_id: req.orgId });
    if (!software) {
      return res.status(400).json({ error: 'software_id does not belong to your organization' });
    }

    const license = await SoftwareLicense.create({
      org_id: req.orgId,
      software_id,
      license_type,
      procurement_id,
      license_key_encrypted,
      total_seats,
      effective_date,
      expiry_date,
      renewal_reminder_days,
      auto_renew,
      annual_cost,
      next_renewal_amount,
      budget_code,
    });

    const result = license.toObject();
    delete result.license_key_encrypted;
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listLicenses(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.software_id) filter.software_id = req.query.software_id;
    if (req.query.status) filter.status = req.query.status;
    const licenses = await SoftwareLicense.find(filter);
    res.json(licenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLicense(req, res) {
  try {
    const license = await SoftwareLicense.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }
    res.json(license);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateLicense(req, res) {
  try {
    const { license_type, total_seats, expiry_date, renewal_reminder_days, auto_renew, annual_cost, next_renewal_amount, budget_code, compliance_status, status } = req.body;

    const license = await SoftwareLicense.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { license_type, total_seats, expiry_date, renewal_reminder_days, auto_renew, annual_cost, next_renewal_amount, budget_code, compliance_status, status },
      { new: true, runValidators: true }
    );

    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }

    res.json(license);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteLicense(req, res) {
  try {
    const license = await SoftwareLicense.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }
    res.json({ message: 'License deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createLicense, listLicenses, getLicense, updateLicense, deleteLicense };
