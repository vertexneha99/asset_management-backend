const Shift = require('../models/shifts');

async function createShift(req, res) {
  try {
    const { name, start_time, end_time, applicable_days, duty_manager_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const shift = await Shift.create({
      org_id: req.orgId,
      name,
      start_time,
      end_time,
      applicable_days,
      duty_manager_id,
    });

    res.status(201).json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listShifts(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.active !== undefined) filter.active = req.query.active === 'true';
    const shifts = await Shift.find(filter);
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getShift(req, res) {
  try {
    const shift = await Shift.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }
    res.json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateShift(req, res) {
  try {
    const { name, start_time, end_time, applicable_days, duty_manager_id, active } = req.body;

    const shift = await Shift.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { name, start_time, end_time, applicable_days, duty_manager_id, active },
      { new: true, runValidators: true }
    );

    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    res.json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteShift(req, res) {
  try {
    const shift = await Shift.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }
    res.json({ message: 'Shift deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createShift, listShifts, getShift, updateShift, deleteShift };
