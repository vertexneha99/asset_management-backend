const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createPreventiveSchedule,
  listPreventiveSchedules,
  getPreventiveSchedule,
  updatePreventiveSchedule,
  deletePreventiveSchedule,
} = require('../controllers/preventiveScheduleController');

router.use(requireAuth);

router.post('/', createPreventiveSchedule);
router.get('/', listPreventiveSchedules);
router.get('/:id', getPreventiveSchedule);
router.put('/:id', updatePreventiveSchedule);
router.delete('/:id', deletePreventiveSchedule);

module.exports = router;
