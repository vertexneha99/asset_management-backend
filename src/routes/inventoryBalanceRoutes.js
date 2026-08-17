const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listInventoryBalances, getInventoryBalance } = require('../controllers/inventoryBalanceController');

router.use(requireAuth);

router.get('/', listInventoryBalances);
router.get('/:id', getInventoryBalance);

module.exports = router;
