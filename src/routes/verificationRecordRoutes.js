const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createVerificationRecord,
  listVerificationRecords,
  getVerificationRecord,
} = require('../controllers/verificationRecordController');

router.use(requireAuth);

router.post('/', createVerificationRecord);
router.get('/', listVerificationRecords);
router.get('/:id', getVerificationRecord);

module.exports = router;
