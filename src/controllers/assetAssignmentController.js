const AssetAssignment = require('../models/asset_assignments');
const Asset = require('../models/assets');

async function createAssignment(req, res) {
  try {
    const { asset_id, assigned_to_type, assigned_to_id, expected_return_date, handover } = req.body;

    if (!asset_id || !assigned_to_type || !assigned_to_id) {
      return res.status(400).json({ error: 'asset_id, assigned_to_type, and assigned_to_id are required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const activeAssignment = await AssetAssignment.findOne({ asset_id, status: 'active' });
    if (activeAssignment) {
      return res.status(409).json({ error: 'This asset is already actively assigned. It must be returned before reassigning.' });
    }

    const assignment = await AssetAssignment.create({
      org_id: req.orgId,
      asset_id,
      assigned_to_type,
      assigned_to_id,
      assigned_by: req.userId,
      expected_return_date,
      handover,
      status: 'active',
    });

    res.status(201).json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listAssignments(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;

    const assignments = await AssetAssignment.find(filter).sort({ assignment_date: -1 });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAssignment(req, res) {
  try {
    const assignment = await AssetAssignment.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
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
