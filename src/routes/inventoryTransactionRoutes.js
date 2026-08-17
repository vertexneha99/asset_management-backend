const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createTransaction,
  listTransactions,
  getTransaction,
} = require('../controllers/inventoryTransactionController');

router.use(requireAuth);

router.post('/', createTransaction);
router.get('/', listTransactions);
router.get('/:id', getTransaction);

module.exports = router;
