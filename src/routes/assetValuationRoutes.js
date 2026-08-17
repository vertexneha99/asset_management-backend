const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAssetValuation,
  listAssetValuations,
  getAssetValuation,
} = require('../controllers/assetValuationController');

router.use(requireAuth);

router.post('/', createAssetValuation);
router.get('/', listAssetValuations);
router.get('/:id', getAssetValuation);

module.exports = router;
