const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAsset,
  listAssets,
  getAsset,
  updateAsset,
  trashAsset,
  restoreAsset,
  deleteAsset,
} = require('../controllers/assetController');

router.use(requireAuth);

router.post('/', createAsset);
router.get('/', listAssets);
router.get('/:id', getAsset);
router.put('/:id', updateAsset);
router.put('/:id/trash', trashAsset);
router.put('/:id/restore', restoreAsset);
router.delete('/:id', deleteAsset);

module.exports = router;
