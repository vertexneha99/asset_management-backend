const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createEmployee,
  listEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

router.use(requireAuth);

router.post('/', createEmployee);
router.get('/', listEmployees);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
