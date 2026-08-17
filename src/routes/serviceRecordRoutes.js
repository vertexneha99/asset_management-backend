const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createServiceRecord,
  listServiceRecords,
  getServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
} = require('../controllers/serviceRecordController');

router.use(requireAuth);

router.post('/', createServiceRecord);
router.get('/', listServiceRecords);
router.get('/:id', getServiceRecord);
router.put('/:id', updateServiceRecord);
router.delete('/:id', deleteServiceRecord);

module.exports = router;
