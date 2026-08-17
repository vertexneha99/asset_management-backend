const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createAlertConfig,
  listAlertConfigs,
  getAlertConfig,
  updateAlertConfig,
  deleteAlertConfig,
} = require('../controllers/alertConfigController');

router.use(requireAuth);

router.post('/', createAlertConfig);
router.get('/', listAlertConfigs);
router.get('/:id', getAlertConfig);
router.put('/:id', updateAlertConfig);
router.delete('/:id', deleteAlertConfig);

module.exports = router;
