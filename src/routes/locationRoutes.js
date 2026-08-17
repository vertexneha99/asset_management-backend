const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createLocation,
  listLocations,
  getLocation,
  updateLocation,
  deleteLocation,
} = require('../controllers/locationController');

router.use(requireAuth);

router.post('/', createLocation);
router.get('/', listLocations);
router.get('/:id', getLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;
