const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAmcAssetLink,
  listAmcAssetLinks,
  getAmcAssetLink,
  deleteAmcAssetLink,
} = require('../controllers/amcAssetLinkController');

router.use(requireAuth);

router.post('/', createAmcAssetLink);
router.get('/', listAmcAssetLinks);
router.get('/:id', getAmcAssetLink);
router.delete('/:id', deleteAmcAssetLink);

module.exports = router;
