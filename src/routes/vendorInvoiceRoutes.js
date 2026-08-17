const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createVendorInvoice,
  listVendorInvoices,
  getVendorInvoice,
  updateVendorInvoice,
  payVendorInvoice,
  deleteVendorInvoice,
} = require('../controllers/vendorInvoiceController');

router.use(requireAuth);

router.post('/', createVendorInvoice);
router.get('/', listVendorInvoices);
router.get('/:id', getVendorInvoice);
router.put('/:id', updateVendorInvoice);
router.post('/:id/pay', payVendorInvoice);
router.delete('/:id', deleteVendorInvoice);

module.exports = router;
