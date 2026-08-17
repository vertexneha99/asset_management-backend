const LicenseAllocation = require('../models/license_allocations');
const SoftwareLicense = require('../models/software_licenses');

async function createAllocation(req, res) {
  try {
    const { license_id, assigned_to_type, assigned_to_id, installation_id } = req.body;

    if (!license_id || !assigned_to_type || !assigned_to_id) {
      return res.status(400).json({ error: 'license_id, assigned_to_type, and assigned_to_id are required' });
    }

    const license = await SoftwareLicense.findOne({ _id: license_id, org_id: req.orgId });
    if (!license) {
      return res.status(400).json({ error: 'license_id does not belong to your organization' });
    }

    if (license.total_seats !== null && license.assigned_seats >= license.total_seats) {
      return res.status(409).json({ error: 'No seats remaining on this license' });
    }

    const allocation = await LicenseAllocation.create({
      org_id: req.orgId,
      license_id,
      assigned_to_type,
      assigned_to_id,
      installation_id,
      assigned_by: req.userId,
    });

    license.assigned_seats = (license.assigned_seats || 0) + 1;
    await license.save();

    res.status(201).json(allocation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listAllocations(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.license_id) filter.license_id = req.query.license_id;
    if (req.query.status) filter.status = req.query.status;
    const allocations = await LicenseAllocation.find(filter);
    res.json(allocations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllocation(req, res) {
  try {
    const allocation = await LicenseAllocation.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!allocation) {
      return res.status(404).json({ error: 'Allocation not found' });
    }
    res.json(allocation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deallocate(req, res) {
  try {
    const { reason_for_deallocation } = req.body;

    const allocation = await LicenseAllocation.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'active' },
      { status: 'inactive', deallocated_date: new Date(), reason_for_deallocation },
      { new: true, runValidators: true }
    );

    if (!allocation) {
      return res.status(404).json({ error: 'Active allocation not found' });
    }

    await SoftwareLicense.findByIdAndUpdate(allocation.license_id, { $inc: { assigned_seats: -1 } });

    res.json(allocation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAllocation(req, res) {
  try {
    const allocation = await LicenseAllocation.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!allocation) {
      return res.status(404).json({ error: 'Allocation not found' });
    }
    res.json({ message: 'Allocation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAllocation, listAllocations, getAllocation, deallocate, deleteAllocation };
