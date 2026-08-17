const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createBatch,
  listBatches,
  getBatch,
  updateBatch,
  deleteBatch,
} = require('../controllers/inventoryBatchController');

router.use(requireAuth);

router.post('/', createBatch);
router.get('/', listBatches);
router.get('/:id', getBatch);
router.put('/:id', updateBatch);
router.delete('/:id', deleteBatch);

module.exports = router;
