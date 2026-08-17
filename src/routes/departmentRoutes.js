const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createDepartment,
  listDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');

router.use(requireAuth);

router.post('/', createDepartment);
router.get('/', listDepartments);
router.get('/:id', getDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;
