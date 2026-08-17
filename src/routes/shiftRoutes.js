const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createShift,
  listShifts,
  getShift,
  updateShift,
  deleteShift,
} = require('../controllers/shiftController');

router.use(requireAuth);

router.post('/', createShift);
router.get('/', listShifts);
router.get('/:id', getShift);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);

module.exports = router;
