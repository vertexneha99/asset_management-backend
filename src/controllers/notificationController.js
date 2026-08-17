const Notification = require('../models/notifications');

async function createNotification(req, res) {
  try {
    const { user_id, type, severity, title, body, related_entity_type, related_entity_id, channels, route } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    const notification = await Notification.create({
      org_id: req.orgId,
      user_id,
      type,
      severity,
      title,
      body,
      related_entity_type,
      related_entity_id,
      channels,
      route,
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listNotifications(req, res) {
  try {
    const filter = { org_id: req.orgId, user_id: req.query.user_id || req.userId };
    if (req.query.unread === 'true') filter.read_at = null;
    const notifications = await Notification.find(filter).sort({ created_at: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getNotification(req, res) {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markAsRead(req, res) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { read_at: new Date() },
      { new: true, runValidators: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createNotification, listNotifications, getNotification, markAsRead, deleteNotification };
