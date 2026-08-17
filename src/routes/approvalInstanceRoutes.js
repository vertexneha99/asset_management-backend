const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createInstance,
  listInstances,
  getInstance,
  submitInstance,
} = require('../controllers/approvalInstanceController');

router.use(requireAuth);

router.post('/', createInstance);
router.get('/', listInstances);
router.get('/:id', getInstance);
router.post('/:id/submit', submitInstance);

module.exports = router;
