const mongoose = require('mongoose');
const { Schema } = mongoose;

const telemetryEventSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  sensor_type: { type: String, trim: true },
  timestamp: { type: Date, default: Date.now },
  metrics: { type: Schema.Types.Mixed, default: {} },
  source: { type: Schema.Types.Mixed, default: {} },
});

telemetryEventSchema.index({ org_id: 1, asset_id: 1, timestamp: 1 });

module.exports = mongoose.model('TelemetryEvent', telemetryEventSchema, 'telemetry_events');
