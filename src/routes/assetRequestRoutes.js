const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAssetRequest,
  listAssetRequests,
  getAssetRequest,
  updateAssetRequest,
  deleteAssetRequest,
} = require('../controllers/assetRequestController');

router.use(requireAuth);

router.post('/', createAssetRequest);
router.get('/', listAssetRequests);
router.get('/:id', getAssetRequest);
router.put('/:id', updateAssetRequest);
router.delete('/:id', deleteAssetRequest);

module.exports = router;
