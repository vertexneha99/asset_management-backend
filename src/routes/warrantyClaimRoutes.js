const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createWarrantyClaim,
  listWarrantyClaims,
  getWarrantyClaim,
  updateWarrantyClaim,
  deleteWarrantyClaim,
} = require('../controllers/warrantyClaimController');

router.use(requireAuth);

router.post('/', createWarrantyClaim);
router.get('/', listWarrantyClaims);
router.get('/:id', getWarrantyClaim);
router.put('/:id', updateWarrantyClaim);
router.delete('/:id', deleteWarrantyClaim);

module.exports = router;
