const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAction,
  listActions,
  getAction,
} = require('../controllers/approvalActionController');

router.use(requireAuth);

router.post('/', createAction);
router.get('/', listActions);
router.get('/:id', getAction);

module.exports = router;
