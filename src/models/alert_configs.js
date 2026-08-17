const mongoose = require('mongoose');
const { Schema } = mongoose;

const alertConfigSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  alert_type: { type: String, required: true, trim: true },
  enabled: { type: Boolean, default: true },
  threshold: { type: Schema.Types.Mixed, default: {} },
  escalation_hours: { type: Number, default: null },
  digest_mode: { type: String, trim: true },
});

alertConfigSchema.index({ org_id: 1, alert_type: 1 }, { unique: true });

module.exports = mongoose.model('AlertConfig', alertConfigSchema, 'alert_configs');
