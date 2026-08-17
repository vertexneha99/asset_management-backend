const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createDisposalRecord,
  listDisposalRecords,
  getDisposalRecord,
  finalizeDisposal,
} = require('../controllers/disposalRecordController');

router.use(requireAuth);

router.post('/', createDisposalRecord);
router.get('/', listDisposalRecords);
router.get('/:id', getDisposalRecord);
router.post('/:id/finalize', finalizeDisposal);

module.exports = router;
