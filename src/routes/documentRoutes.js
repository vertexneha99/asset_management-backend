const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createDocument,
  listDocuments,
  getDocument,
  deleteDocument,
} = require('../controllers/documentController');

router.use(requireAuth);

router.post('/', createDocument);
router.get('/', listDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
