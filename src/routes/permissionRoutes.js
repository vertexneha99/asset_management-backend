const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const { listPermissions, getPermission } = require('../controllers/permissionController');

router.use(requireAuth);

router.get('/', listPermissions);
router.get('/:id', getPermission);

module.exports = router;
