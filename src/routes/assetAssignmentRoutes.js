const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAssignment,
  listAssignments,
  getAssignment,
  updateAssignment,
  returnAssignment,
  deleteAssignment,
} = require('../controllers/assetAssignmentController');

router.use(requireAuth);

router.post('/', createAssignment);
router.get('/', listAssignments);
router.get('/:id', getAssignment);
router.put('/:id', updateAssignment);
router.post('/:id/return', returnAssignment);
router.delete('/:id', deleteAssignment);

module.exports = router;
