const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createVendor,
  listVendors,
  getVendor,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendorController');

router.use(requireAuth);

router.post('/', createVendor);
router.get('/', listVendors);
router.get('/:id', getVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
