const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createRelationship,
  listRelationships,
  getRelationship,
  removeRelationship,
  deleteRelationship,
} = require('../controllers/assetRelationshipController');

router.use(requireAuth);

router.post('/', createRelationship);
router.get('/', listRelationships);
router.get('/:id', getRelationship);
router.post('/:id/remove', removeRelationship);
router.delete('/:id', deleteRelationship);

module.exports = router;
