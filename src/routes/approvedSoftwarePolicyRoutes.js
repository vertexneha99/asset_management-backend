const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createPolicy,
  listPolicies,
  getPolicy,
  updatePolicy,
  deletePolicy,
} = require('../controllers/approvedSoftwarePolicyController');

router.use(requireAuth);

router.post('/', createPolicy);
router.get('/', listPolicies);
router.get('/:id', getPolicy);
router.put('/:id', updatePolicy);
router.delete('/:id', deletePolicy);

module.exports = router;
