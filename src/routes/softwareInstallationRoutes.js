const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createInstallation,
  listInstallations,
  getInstallation,
  uninstall,
  deleteInstallation,
} = require('../controllers/softwareInstallationController');

router.use(requireAuth);

router.post('/', createInstallation);
router.get('/', listInstallations);
router.get('/:id', getInstallation);
router.post('/:id/uninstall', uninstall);
router.delete('/:id', deleteInstallation);

module.exports = router;
