const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createRole,
  listRoles,
  getRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');

router.use(requireAuth);

router.post('/', createRole);
router.get('/', listRoles);
router.get('/:id', getRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
