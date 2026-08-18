const AssetAssignment = require('../models/asset_assignments');
const Asset = require('../models/assets');
const Employee = require('../models/employees');

/** Frontend only knows employee names, so resolve/create the Employee record. */
async function findOrCreateEmployee(orgId, name) {
  let employee = await Employee.findOne({ org_id: orgId, name });
  if (employee) return employee;
  return Employee.create({ org_id: orgId, name });
}

/**
 * Flattens an AssetAssignment (with asset_id -> item_master_id and
 * assigned_to_id populated) into the shape lib/models/asset.dart's
 * AssignmentRecord.fromJson expects.
 */
function toAssignmentDto(assignment) {
  const asset = assignment.asset_id || {};
  const itemMaster = asset.item_master_id || {};
  const employee = assignment.assigned_to_id || {};
  const handover = assignment.handover || {};
  const acknowledgement = assignment.acknowledgement || {};

  return {
    id: assignment._id,
    assetId: asset.asset_tag || '',
    assetName: itemMaster.name || '',
    employee: employee.name || '',
    department: handover.department || '',
    location: handover.location || '',
    assignedOn: assignment.assignment_date,
    expectedReturn: assignment.expected_return_date,
    conditionAtHandover: handover.condition || '',
    status: assignment.status === 'active' ? 'Active' : 'Returned',
    accessories: handover.accessories || [],
    notes: handover.notes || '',
    acknowledged: acknowledgement.acknowledged || false,
  };
}

async function createAssignment(req, res) {
  try {
    const { assetId, employee, department, location, expectedReturn, conditionAtHandover, accessories, notes, acknowledged } = req.body;

    if (!assetId || !employee) {
      return res.status(400).json({ error: 'assetId and employee are required' });
    }

    const asset = await Asset.findOne({ _id: assetId, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'assetId does not belong to your organization' });
    }

    const activeAssignment = await AssetAssignment.findOne({ asset_id: assetId, status: 'active' });
    if (activeAssignment) {
      return res.status(409).json({ error: 'This asset is already actively assigned. It must be returned before reassigning.' });
    }

    const employeeDoc = await findOrCreateEmployee(req.orgId, employee);

    const assignment = await AssetAssignment.create({
      org_id: req.orgId,
      asset_id: assetId,
      assigned_to_type: 'Employee',
      assigned_to_id: employeeDoc._id,
      assigned_by: req.userId,
      expected_return_date: expectedReturn,
      handover: { department, location, condition: conditionAtHandover, accessories, notes },
      acknowledgement: { acknowledged: acknowledged || false },
      status: 'active',
    });

    await assignment.populate([
      { path: 'asset_id', populate: { path: 'item_master_id' } },
      { path: 'assigned_to_id' },
    ]);
    res.status(201).json(toAssignmentDto(assignment));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listAssignments(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;

    const assignments = await AssetAssignment.find(filter)
      .populate([
        { path: 'asset_id', populate: { path: 'item_master_id' } },
        { path: 'assigned_to_id' },
      ])
      .sort({ assignment_date: -1 });
    res.json(assignments.map(toAssignmentDto));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAssignment(req, res) {
  try {
    const assignment = await AssetAssignment.findOne({ _id: req.params.id, org_id: req.orgId }).populate([
      { path: 'asset_id', populate: { path: 'item_master_id' } },
      { path: 'assigned_to_id' },
    ]);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(toAssignmentDto(assignment));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAssignment(req, res) {
  try {
    const { expected_return_date, handover } = req.body;

    const assignment = await AssetAssignment.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'active' },
      { expected_return_date, handover },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ error: 'Active assignment not found' });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function returnAssignment(req, res) {
  try {
    const { return_details, acknowledgement } = req.body;

    const assignment = await AssetAssignment.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'active' },
      {
        status: 'returned',
        actual_return_date: new Date(),
        return_details,
        acknowledgement,
      },
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({ error: 'Active assignment not found' });
    }

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAssignment(req, res) {
  try {
    const assignment = await AssetAssignment.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAssignment, listAssignments, getAssignment, updateAssignment, returnAssignment, deleteAssignment };
