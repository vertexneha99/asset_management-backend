const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createNotification,
  listNotifications,
  getNotification,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

router.use(requireAuth);

router.post('/', createNotification);
router.get('/', listNotifications);
router.get('/:id', getNotification);
router.post('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
