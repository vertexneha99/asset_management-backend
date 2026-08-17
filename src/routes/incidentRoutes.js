const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createIncident,
  listIncidents,
  getIncident,
  updateIncident,
  deleteIncident,
} = require('../controllers/incidentController');

router.use(requireAuth);

router.post('/', createIncident);
router.get('/', listIncidents);
router.get('/:id', getIncident);
router.put('/:id', updateIncident);
router.delete('/:id', deleteIncident);

module.exports = router;
