const AssetLoan = require('../models/asset_loans');
const Asset = require('../models/assets');

async function createLoan(req, res) {
  try {
    const { asset_id, borrower, expected_return, purpose, condition_at_issue, accessories } = req.body;

    if (!asset_id || !borrower) {
      return res.status(400).json({ error: 'asset_id and borrower are required' });
    }

    const asset = await Asset.findOne({ _id: asset_id, org_id: req.orgId });
    if (!asset) {
      return res.status(400).json({ error: 'asset_id does not belong to your organization' });
    }

    const activeLoan = await AssetLoan.findOne({ asset_id, status: 'active' });
    if (activeLoan) {
      return res.status(409).json({ error: 'This asset is already out on an active loan. It must be returned before loaning again.' });
    }

    const loan = await AssetLoan.create({
      org_id: req.orgId,
      asset_id,
      borrower,
      expected_return,
      purpose,
      condition_at_issue,
      accessories,
      status: 'active',
    });

    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listLoans(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.asset_id) filter.asset_id = req.query.asset_id;
    if (req.query.status) filter.status = req.query.status;

    const loans = await AssetLoan.find(filter).sort({ loan_date: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLoan(req, res) {
  try {
    const loan = await AssetLoan.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateLoan(req, res) {
  try {
    const { expected_return, purpose, accessories } = req.body;

    const loan = await AssetLoan.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'active' },
      { expected_return, purpose, accessories },
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ error: 'Active loan not found' });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function returnLoan(req, res) {
  try {
    const { condition_at_return, damage_details } = req.body;

    const loan = await AssetLoan.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, status: 'active' },
      {
        status: 'returned',
        actual_return: new Date(),
        condition_at_return,
        damage_details,
      },
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({ error: 'Active loan not found' });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteLoan(req, res) {
  try {
    const loan = await AssetLoan.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json({ message: 'Loan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createLoan, listLoans, getLoan, updateLoan, returnLoan, deleteLoan };
