const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createDepreciationProfile,
  listDepreciationProfiles,
  getDepreciationProfile,
  updateDepreciationProfile,
  deleteDepreciationProfile,
} = require('../controllers/depreciationProfileController');

router.use(requireAuth);

router.post('/', createDepreciationProfile);
router.get('/', listDepreciationProfiles);
router.get('/:id', getDepreciationProfile);
router.put('/:id', updateDepreciationProfile);
router.delete('/:id', deleteDepreciationProfile);

module.exports = router;
