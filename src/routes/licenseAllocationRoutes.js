const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAllocation,
  listAllocations,
  getAllocation,
  deallocate,
  deleteAllocation,
} = require('../controllers/licenseAllocationController');

router.use(requireAuth);

router.post('/', createAllocation);
router.get('/', listAllocations);
router.get('/:id', getAllocation);
router.post('/:id/deallocate', deallocate);
router.delete('/:id', deleteAllocation);

module.exports = router;
