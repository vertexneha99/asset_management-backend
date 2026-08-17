const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createLifecycleEvent,
  listLifecycleEvents,
  getLifecycleEvent,
} = require('../controllers/assetLifecycleEventController');

router.use(requireAuth);

router.post('/', createLifecycleEvent);
router.get('/', listLifecycleEvents);
router.get('/:id', getLifecycleEvent);

module.exports = router;
