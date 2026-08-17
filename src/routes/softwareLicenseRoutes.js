const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createLicense,
  listLicenses,
  getLicense,
  updateLicense,
  deleteLicense,
} = require('../controllers/softwareLicenseController');

router.use(requireAuth);

router.post('/', createLicense);
router.get('/', listLicenses);
router.get('/:id', getLicense);
router.put('/:id', updateLicense);
router.delete('/:id', deleteLicense);

module.exports = router;
