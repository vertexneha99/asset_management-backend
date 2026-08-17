const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAuditEvent,
  listAuditEvents,
  getAuditEvent,
} = require('../controllers/auditEventController');

router.use(requireAuth);

router.post('/', createAuditEvent);
router.get('/', listAuditEvents);
router.get('/:id', getAuditEvent);

module.exports = router;
