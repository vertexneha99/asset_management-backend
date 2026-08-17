const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAsset,
  listAssets,
  getAsset,
  updateAsset,
  deleteAsset,
} = require('../controllers/assetController');

router.use(requireAuth);

router.post('/', createAsset);
router.get('/', listAssets);
router.get('/:id', getAsset);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

module.exports = router;
