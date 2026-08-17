const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createRolePermission,
  listRolePermissions,
  getRolePermission,
  deleteRolePermission,
} = require('../controllers/rolePermissionController');

router.use(requireAuth);

router.post('/', createRolePermission);
router.get('/', listRolePermissions);
router.get('/:id', getRolePermission);
router.delete('/:id', deleteRolePermission);

module.exports = router;
