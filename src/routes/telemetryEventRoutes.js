const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createTelemetryEvent,
  listTelemetryEvents,
  getTelemetryEvent,
} = require('../controllers/telemetryEventController');

router.use(requireAuth);

router.post('/', createTelemetryEvent);
router.get('/', listTelemetryEvents);
router.get('/:id', getTelemetryEvent);

module.exports = router;
