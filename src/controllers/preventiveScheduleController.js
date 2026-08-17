const PreventiveSchedule = require('../models/preventive_schedules');
const Asset = require('../models/assets');

async function createPreventiveSchedule(req, res) {
  try {
    const { asset_id, maintenance_type, frequency, frequency_value, next_due, next_due_meter, assigned_to_id, estimated_duration_hours, estimated_cost, sla_completion_hours, checklist_template } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const schedule = await PreventiveSchedule.create({
      org_id: req.orgId,
      asset_id,
      maintenance_type,
      frequency,
      frequency_value,
      next_due,
      next_due_meter,
      assigned_to_id,
      estimated_duration_hours,
      estimated_cost,
      sla_completion_hours,
      checklist_template,
    });

    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listPreventiveSchedules(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.active !== undefined) filter.active = req.query.active === 'true';
    const schedules = await PreventiveSchedule.find(filter);
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getPreventiveSchedule(req, res) {
  try {
    const schedule = await PreventiveSchedule.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!schedule) {
      return res.status(404).json({ error: 'Preventive schedule not found' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePreventiveSchedule(req, res) {
  try {
    const { maintenance_type, frequency, frequency_value, next_due, next_due_meter, assigned_to_id, estimated_duration_hours, estimated_cost, sla_completion_hours, checklist_template, active } = req.body;

    const schedule = await PreventiveSchedule.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { maintenance_type, frequency, frequency_value, next_due, next_due_meter, assigned_to_id, estimated_duration_hours, estimated_cost, sla_completion_hours, checklist_template, active },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ error: 'Preventive schedule not found' });
    }

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deletePreventiveSchedule(req, res) {
  try {
    const schedule = await PreventiveSchedule.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!schedule) {
      return res.status(404).json({ error: 'Preventive schedule not found' });
    }
    res.json({ message: 'Preventive schedule deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPreventiveSchedule, listPreventiveSchedules, getPreventiveSchedule, updatePreventiveSchedule, deletePreventiveSchedule };
