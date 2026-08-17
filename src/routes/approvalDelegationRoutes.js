const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createDelegation,
  listDelegations,
  getDelegation,
  updateDelegation,
  deleteDelegation,
} = require('../controllers/approvalDelegationController');

router.use(requireAuth);

router.post('/', createDelegation);
router.get('/', listDelegations);
router.get('/:id', getDelegation);
router.put('/:id', updateDelegation);
router.delete('/:id', deleteDelegation);

module.exports = router;
