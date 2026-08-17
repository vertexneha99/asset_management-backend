const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, trim: true },
    severity: { type: String, trim: true },
    title: { type: String, trim: true },
    body: { type: String, trim: true },
    related_entity_type: { type: String, trim: true },
    related_entity_id: { type: Schema.Types.ObjectId, default: null },
    channels: { type: Schema.Types.Mixed, default: [] },
    route: { type: String, trim: true },
    read_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

notificationSchema.index({ org_id: 1, user_id: 1, read_at: 1 });

module.exports = mongoose.model('Notification', notificationSchema, 'notifications');
