const AssetTransfer = require('../models/asset_transfers');
const Asset = require('../models/assets');

async function createTransfer(req, res) {
  try {
    const { asset_id, from_context, to_context, reason, condition_before } = req.body;

    if (!asset_id) {
      return res.status(400).json({ error: 'asset_id is required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const transfer = await AssetTransfer.create({
      org_id: req.orgId,
      asset_id,
      from_context,
      to_context,
      reason,
      condition_before,
      status: 'pending',
    });

    res.status(201).json(transfer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listTransfers(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;

    const transfers = await AssetTransfer.find(filter).sort({ transfer_date: -1 });
    res.json(transfers);
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
