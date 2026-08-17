const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAmcContract,
  listAmcContracts,
  getAmcContract,
  updateAmcContract,
  deleteAmcContract,
} = require('../controllers/amcContractController');

router.use(requireAuth);

router.post('/', createAmcContract);
router.get('/', listAmcContracts);
router.get('/:id', getAmcContract);
router.put('/:id', updateAmcContract);
router.delete('/:id', deleteAmcContract);

module.exports = router;
