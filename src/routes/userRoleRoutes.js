const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createUserRole,
  listUserRoles,
  getUserRole,
  updateUserRole,
  deleteUserRole,
} = require('../controllers/userRoleController');

router.use(requireAuth);

router.post('/', createUserRole);
router.get('/', listUserRoles);
router.get('/:id', getUserRole);
router.put('/:id', updateUserRole);
router.delete('/:id', deleteUserRole);

module.exports = router;
