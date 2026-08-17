const Employee = require('../models/employees');

async function createEmployee(req, res) {
  try {
    const { employee_code, name, designation, department_id, email, hrms_source_id, status, leave_state } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const employee = await Employee.create({
      org_id: req.orgId,
      employee_code,
      name,
      designation,
      department_id: department_id || null,
      email,
      hrms_source_id,
      status,
      leave_state,
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listEmployees(req, res) {
  try {
    const employees = await Employee.find({ org_id: req.orgId }).sort({ name: 1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getEmployee(req, res) {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateEmployee(req, res) {
  try {
    const { employee_code, name, designation, department_id, email, hrms_source_id, status, leave_state } = req.body;

    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { employee_code, name, designation, department_id, email, hrms_source_id, status, leave_state },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteEmployee(req, res) {
  try {
    const employee = await Employee.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createEmployee, listEmployees, getEmployee, updateEmployee, deleteEmployee };
