const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  generateSku,
  createItemMaster,
  listItemMasters,
  getItemMaster,
  updateItemMaster,
  deleteItemMaster,
} = require('../controllers/itemMasterController');

router.use(requireAuth);

router.post('/', createItemMaster);
router.get('/', listItemMasters);
router.get('/generate-sku', generateSku);
router.get('/:id', getItemMaster);
router.put('/:id', updateItemMaster);
router.delete('/:id', deleteItemMaster);

module.exports = router;
