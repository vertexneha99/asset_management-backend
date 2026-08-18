const AssetTransfer = require('../models/asset_transfers');
const Asset = require('../models/assets');

/**
 * Flattens an AssetTransfer (with asset_id -> item_master_id populated)
 * into the shape lib/models/asset.dart's TransferRecord.fromJson expects.
 */
function toTransferDto(transfer) {
  const asset = transfer.asset_id || {};
  const itemMaster = asset.item_master_id || {};
  const from = transfer.from_context || {};
  const to = transfer.to_context || {};

  return {
    id: transfer._id,
    assetId: asset.asset_tag || '',
    assetName: itemMaster.name || '',
    fromEmployee: from.employee || '',
    toEmployee: to.employee || '',
    fromDepartment: from.department || '',
    toDepartment: to.department || '',
    fromLocation: from.location || '',
    toLocation: to.location || '',
    transferDate: transfer.transfer_date,
    reason: transfer.reason || '',
    approver: to.approver || '',
    status: transfer.status === 'pending' ? 'Pending Approval' : 'Completed',
    conditionBefore: transfer.condition_before || 'Good',
    conditionAfter: transfer.condition_after || 'Good',
  };
}

async function createTransfer(req, res) {
  try {
    const {
      assetId, fromEmployee, toEmployee, fromDepartment, toDepartment,
      fromLocation, toLocation, transferDate, reason, approver, conditionBefore,
    } = req.body;

    if (!assetId || !reason) {
      return res.status(400).json({ error: 'assetId and reason are required' });
    }

    const asset = await Asset.findOne({ _id: assetId, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'assetId does not belong to your organization' });
    }

    const transfer = await AssetTransfer.create({
      org_id: req.orgId,
      asset_id: assetId,
      from_context: { employee: fromEmployee, department: fromDepartment, location: fromLocation },
      to_context: { employee: toEmployee, department: toDepartment, location: toLocation, approver },
      transfer_date: transferDate,
      reason,
      condition_before: conditionBefore,
      status: 'pending',
    });

    await transfer.populate({ path: 'asset_id', populate: { path: 'item_master_id' } });
    res.status(201).json(toTransferDto(transfer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listTransfers(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;

    const transfers = await AssetTransfer.find(filter)
      .populate({ path: 'asset_id', populate: { path: 'item_master_id' } })
      .sort({ transfer_date: -1 });
    res.json(transfers.map(toTransferDto));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTransfer(req, res) {
  try {
    const transfer = await AssetTransfer.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }
    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateTransfer(req, res) {
  try {
    const { from_context, to_context, reason, condition_before } = req.body;

    const transfer = await AssetTransfer.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'pending' },
      { from_context, to_context, reason, condition_before },
      { new: true, runValidators: true }
    );

    if (!transfer) {
      return res.status(404).json({ error: 'Pending transfer not found' });
    }

    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function approveTransfer(req, res) {
  try {
    const { condition_after } = req.body;

    const transfer = await AssetTransfer.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'pending' },
      { status: 'completed', approver_id: req.userId, condition_after },
      { new: true, runValidators: true }
    );

    if (!transfer) {
      return res.status(404).json({ error: 'Pending transfer not found' });
    }

    res.json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteTransfer(req, res) {
  try {
    const transfer = await AssetTransfer.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }
    res.json({ message: 'Transfer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createTransfer, listTransfers, getTransfer, updateTransfer, approveTransfer, deleteTransfer };
