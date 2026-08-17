const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createPurchaseRequest,
  listPurchaseRequests,
  getPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest,
} = require('../controllers/purchaseRequestController');

router.use(requireAuth);

router.post('/', createPurchaseRequest);
router.get('/', listPurchaseRequests);
router.get('/:id', getPurchaseRequest);
router.put('/:id', updatePurchaseRequest);
router.delete('/:id', deletePurchaseRequest);

module.exports = router;
