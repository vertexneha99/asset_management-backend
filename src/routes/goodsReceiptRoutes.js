const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createGoodsReceipt,
  listGoodsReceipts,
  getGoodsReceipt,
  updateGoodsReceipt,
  deleteGoodsReceipt,
} = require('../controllers/goodsReceiptController');

router.use(requireAuth);

router.post('/', createGoodsReceipt);
router.get('/', listGoodsReceipts);
router.get('/:id', getGoodsReceipt);
router.put('/:id', updateGoodsReceipt);
router.delete('/:id', deleteGoodsReceipt);

module.exports = router;
