const AmcContract = require('../models/amc_contracts');
const Vendor = require('../models/vendors');

async function createAmcContract(req, res) {
  try {
    const { contract_number, vendor_id, start_date, end_date, contract_amount, service_frequency, response_time, coverage_details, renewal_reminder_days } = req.body;

    if (!contract_number || !vendor_id) {
      return res.status(400).json({ error: 'contract_number and vendor_id are required' });
    }

    const vendor = await Vendor.findOne({ _id: vendor_id, org_id: req.orgId, deleted_at: null });
    if (!vendor) {
      return res.status(400).json({ error: 'vendor_id does not belong to your organization' });
    }

    const amcContract = await AmcContract.create({
      org_id: req.orgId,
      contract_number,
      vendor_id,
      start_date,
      end_date,
      contract_amount,
      service_frequency,
      response_time,
      coverage_details,
      renewal_reminder_days,
    });

    res.status(201).json(amcContract);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An AMC contract with this contract_number already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listAmcContracts(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.vendor_id) filter.vendor_id = req.query.vendor_id;
    if (req.query.status) filter.status = req.query.status;
    const amcContracts = await AmcContract.find(filter);
    res.json(amcContracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAmcContract(req, res) {
  try {
    const amcContract = await AmcContract.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!amcContract) {
      return res.status(404).json({ error: 'AMC contract not found' });
    }
    res.json(amcContract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAmcContract(req, res) {
  try {
    const { start_date, end_date, contract_amount, service_frequency, response_time, coverage_details, renewal_reminder_days, status } = req.body;

    const amcContract = await AmcContract.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { start_date, end_date, contract_amount, service_frequency, response_time, coverage_details, renewal_reminder_days, status },
      { new: true, runValidators: true }
    );

    if (!amcContract) {
      return res.status(404).json({ error: 'AMC contract not found' });
    }

    res.json(amcContract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAmcContract(req, res) {
  try {
    const amcContract = await AmcContract.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!amcContract) {
      return res.status(404).json({ error: 'AMC contract not found' });
    }
    res.json({ message: 'AMC contract deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAmcContract, listAmcContracts, getAmcContract, updateAmcContract, deleteAmcContract };
