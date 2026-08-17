const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createLocationEvent,
  listLocationEvents,
  getLocationEvent,
} = require('../controllers/assetLocationEventController');

router.use(requireAuth);

router.post('/', createLocationEvent);
router.get('/', listLocationEvents);
router.get('/:id', getLocationEvent);

module.exports = router;
