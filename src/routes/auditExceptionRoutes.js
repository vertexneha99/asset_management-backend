const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAuditException,
  listAuditExceptions,
  getAuditException,
  updateAuditException,
  deleteAuditException,
} = require('../controllers/auditExceptionController');

router.use(requireAuth);

router.post('/', createAuditException);
router.get('/', listAuditExceptions);
router.get('/:id', getAuditException);
router.put('/:id', updateAuditException);
router.delete('/:id', deleteAuditException);

module.exports = router;
