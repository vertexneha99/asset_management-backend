const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createFilterPreset,
  listFilterPresets,
  getFilterPreset,
  updateFilterPreset,
  deleteFilterPreset,
} = require('../controllers/filterPresetController');

router.use(requireAuth);

router.post('/', createFilterPreset);
router.get('/', listFilterPresets);
router.get('/:id', getFilterPreset);
router.put('/:id', updateFilterPreset);
router.delete('/:id', deleteFilterPreset);

module.exports = router;
