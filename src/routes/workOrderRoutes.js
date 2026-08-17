const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createWorkOrder,
  listWorkOrders,
  getWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
} = require('../controllers/workOrderController');

router.use(requireAuth);

router.post('/', createWorkOrder);
router.get('/', listWorkOrders);
router.get('/:id', getWorkOrder);
router.put('/:id', updateWorkOrder);
router.delete('/:id', deleteWorkOrder);

module.exports = router;
