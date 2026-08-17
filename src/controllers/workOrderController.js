const WorkOrder = require('../models/work_orders');
const Asset = require('../models/assets');

async function createWorkOrder(req, res) {
  try {
    const { work_order_no, asset_id, maintenance_type, trigger, fault_description, priority, technician_id, vendor_id, scheduled_date, estimated_cost } = req.body;

    if (!work_order_no || !asset_id) {
      return res.status(400).json({ error: 'work_order_no and asset_id are required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const workOrder = await WorkOrder.create({
      org_id: req.orgId,
      work_order_no,
      asset_id,
      maintenance_type,
      trigger,
      fault_description,
      priority,
      technician_id,
      vendor_id,
      scheduled_date,
      estimated_cost,
    });

    res.status(201).json(workOrder);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A work order with this work_order_no already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listWorkOrders(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.technician_id) filter.technician_id = req.query.technician_id;
    const workOrders = await WorkOrder.find(filter).sort({ opened_date: -1 });
    res.json(workOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getWorkOrder(req, res) {
  try {
    const workOrder = await WorkOrder.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!workOrder) {
      return res.status(404).json({ error: 'Work order not found' });
    }
    res.json(workOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateWorkOrder(req, res) {
  try {
    const {
      maintenance_type, trigger, fault_description, priority, technician_id, vendor_id, status,
      scheduled_date, started_date, completed_on, downtime_hours, work_performed, parts_used,
      labour_hours, estimated_cost, actual_cost, vendor_invoice_ref, condition_after, next_pm_date, checklist, notes,
    } = req.body;

    const workOrder = await WorkOrder.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      {
        maintenance_type, trigger, fault_description, priority, technician_id, vendor_id, status,
        scheduled_date, started_date, completed_on, downtime_hours, work_performed, parts_used,
        labour_hours, estimated_cost, actual_cost, vendor_invoice_ref, condition_after, next_pm_date, checklist, notes,
      },
      { new: true, runValidators: true }
    );

    if (!workOrder) {
      return res.status(404).json({ error: 'Work order not found' });
    }

    res.json(workOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteWorkOrder(req, res) {
  try {
    const workOrder = await WorkOrder.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!workOrder) {
      return res.status(404).json({ error: 'Work order not found' });
    }
    res.json({ message: 'Work order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createWorkOrder, listWorkOrders, getWorkOrder, updateWorkOrder, deleteWorkOrder };
