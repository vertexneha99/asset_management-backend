const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createItAssetProfile,
  listItAssetProfiles,
  getItAssetProfile,
  updateItAssetProfile,
  deleteItAssetProfile,
} = require('../controllers/itAssetProfileController');

router.use(requireAuth);

router.post('/', createItAssetProfile);
router.get('/', listItAssetProfiles);
router.get('/:id', getItAssetProfile);
router.put('/:id', updateItAssetProfile);
router.delete('/:id', deleteItAssetProfile);

module.exports = router;
