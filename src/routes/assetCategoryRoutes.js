const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAssetCategory,
  listAssetCategories,
  getAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
} = require('../controllers/assetCategoryController');

router.use(requireAuth);

router.post('/', createAssetCategory);
router.get('/', listAssetCategories);
router.get('/:id', getAssetCategory);
router.put('/:id', updateAssetCategory);
router.delete('/:id', deleteAssetCategory);

module.exports = router;
