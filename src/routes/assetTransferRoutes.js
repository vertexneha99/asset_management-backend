const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createTransfer,
  listTransfers,
  getTransfer,
  updateTransfer,
  approveTransfer,
  deleteTransfer,
} = require('../controllers/assetTransferController');

router.use(requireAuth);

router.post('/', createTransfer);
router.get('/', listTransfers);
router.get('/:id', getTransfer);
router.put('/:id', updateTransfer);
router.post('/:id/approve', approveTransfer);
router.delete('/:id', deleteTransfer);

module.exports = router;
