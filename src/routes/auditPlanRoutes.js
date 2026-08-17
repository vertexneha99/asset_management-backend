const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAuditPlan,
  listAuditPlans,
  getAuditPlan,
  updateAuditPlan,
  deleteAuditPlan,
} = require('../controllers/auditPlanController');

router.use(requireAuth);

router.post('/', createAuditPlan);
router.get('/', listAuditPlans);
router.get('/:id', getAuditPlan);
router.put('/:id', updateAuditPlan);
router.delete('/:id', deleteAuditPlan);

module.exports = router;
