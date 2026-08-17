const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createWarranty,
  listWarranties,
  getWarranty,
  updateWarranty,
  deleteWarranty,
} = require('../controllers/warrantyController');

router.use(requireAuth);

router.post('/', createWarranty);
router.get('/', listWarranties);
router.get('/:id', getWarranty);
router.put('/:id', updateWarranty);
router.delete('/:id', deleteWarranty);

module.exports = router;
