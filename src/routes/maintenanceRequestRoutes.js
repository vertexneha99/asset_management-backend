const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createMaintenanceRequest,
  listMaintenanceRequests,
  getMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
} = require('../controllers/maintenanceRequestController');

router.use(requireAuth);

router.post('/', createMaintenanceRequest);
router.get('/', listMaintenanceRequests);
router.get('/:id', getMaintenanceRequest);
router.put('/:id', updateMaintenanceRequest);
router.delete('/:id', deleteMaintenanceRequest);

module.exports = router;
