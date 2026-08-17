const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditEventSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    entity_type: { type: String, required: true, trim: true },
    entity_id: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, trim: true },
    actor_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    actor_ip: { type: String, trim: true },
    before_state: { type: Schema.Types.Mixed, default: null },
    after_state: { type: Schema.Types.Mixed, default: null },
    field_diffs: { type: Schema.Types.Mixed, default: null },
    request_metadata: { type: Schema.Types.Mixed, default: {} },
    prev_hash: { type: String, trim: true },
    hash: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

auditEventSchema.index({ org_id: 1, entity_type: 1, entity_id: 1, created_at: 1 });

module.exports = mongoose.model('AuditEvent', auditEventSchema, 'audit_events');
