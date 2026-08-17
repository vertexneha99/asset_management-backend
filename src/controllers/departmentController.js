const Department = require('../models/departments');

async function createDepartment(req, res) {
  try {
    const { name, code, parent_department_id, head_employee_id, cost_center_code, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const department = await Department.create({
      org_id: req.orgId,
      name,
      code,
      parent_department_id: parent_department_id || null,
      head_employee_id: head_employee_id || null,
      cost_center_code,
      status,
    });

    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listDepartments(req, res) {
  try {
    const departments = await Department.find({ org_id: req.orgId }).sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDepartment(req, res) {
  try {
    const department = await Department.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateDepartment(req, res) {
  try {
    const { name, code, parent_department_id, head_employee_id, cost_center_code, status } = req.body;

    const department = await Department.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { name, code, parent_department_id, head_employee_id, cost_center_code, status },
      { new: true, runValidators: true }
    );

    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    res.json(department);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDepartment(req, res) {
  try {
    const department = await Department.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createDepartment, listDepartments, getDepartment, updateDepartment, deleteDepartment };
