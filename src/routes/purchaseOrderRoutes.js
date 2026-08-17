const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createPurchaseOrder,
  listPurchaseOrders,
  getPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require('../controllers/purchaseOrderController');

router.use(requireAuth);

router.post('/', createPurchaseOrder);
router.get('/', listPurchaseOrders);
router.get('/:id', getPurchaseOrder);
router.put('/:id', updatePurchaseOrder);
router.delete('/:id', deletePurchaseOrder);

module.exports = router;
