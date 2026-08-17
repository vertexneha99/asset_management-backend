const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createDepreciationEntry,
  listDepreciationEntries,
  getDepreciationEntry,
} = require('../controllers/depreciationEntryController');

router.use(requireAuth);

router.post('/', createDepreciationEntry);
router.get('/', listDepreciationEntries);
router.get('/:id', getDepreciationEntry);

module.exports = router;
