const mongoose = require('mongoose');
const { Schema } = mongoose;

const outboxEventSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    aggregate_type: { type: String, required: true, trim: true },
    aggregate_id: { type: Schema.Types.ObjectId, required: true },
    event_type: { type: String, required: true, trim: true },
    payload: { type: Schema.Types.Mixed, default: {} },
    idempotency_key: { type: String, trim: true },
    status: { type: String, trim: true, default: 'pending' },
    attempts: { type: Number, default: 0 },
    next_retry_at: { type: Date, default: null },
    processed_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

outboxEventSchema.index(
  { idempotency_key: 1 },
  { unique: true, partialFilterExpression: { idempotency_key: { $exists: true, $type: 'string' } } }
);
outboxEventSchema.index({ status: 1, next_retry_at: 1 });

module.exports = mongoose.model('OutboxEvent', outboxEventSchema, 'outbox_events');
