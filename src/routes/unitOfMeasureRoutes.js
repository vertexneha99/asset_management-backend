const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createUnitOfMeasure,
  listUnitsOfMeasure,
  getUnitOfMeasure,
  updateUnitOfMeasure,
  deleteUnitOfMeasure,
} = require('../controllers/unitOfMeasureController');

router.use(requireAuth);

router.post('/', createUnitOfMeasure);
router.get('/', listUnitsOfMeasure);
router.get('/:id', getUnitOfMeasure);
router.put('/:id', updateUnitOfMeasure);
router.delete('/:id', deleteUnitOfMeasure);

module.exports = router;
