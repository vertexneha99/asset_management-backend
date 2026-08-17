const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createSoftware,
  listSoftware,
  getSoftware,
  updateSoftware,
  deleteSoftware,
} = require('../controllers/softwareCatalogController');

router.use(requireAuth);

router.post('/', createSoftware);
router.get('/', listSoftware);
router.get('/:id', getSoftware);
router.put('/:id', updateSoftware);
router.delete('/:id', deleteSoftware);

module.exports = router;
