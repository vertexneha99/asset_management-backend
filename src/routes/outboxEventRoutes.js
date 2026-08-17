const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listOutboxEvents, getOutboxEvent } = require('../controllers/outboxEventController');

router.use(requireAuth);

router.get('/', listOutboxEvents);
router.get('/:id', getOutboxEvent);

module.exports = router;
