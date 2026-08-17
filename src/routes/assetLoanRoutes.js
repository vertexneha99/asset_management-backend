const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createLoan,
  listLoans,
  getLoan,
  updateLoan,
  returnLoan,
  deleteLoan,
} = require('../controllers/assetLoanController');

router.use(requireAuth);

router.post('/', createLoan);
router.get('/', listLoans);
router.get('/:id', getLoan);
router.put('/:id', updateLoan);
router.post('/:id/return', returnLoan);
router.delete('/:id', deleteLoan);

module.exports = router;
