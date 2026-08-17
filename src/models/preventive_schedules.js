const mongoose = require('mongoose');
const { Schema } = mongoose;

const preventiveScheduleSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  maintenance_type: { type: String, trim: true },
  frequency: { type: String, trim: true },
  frequency_value: { type: Number, default: null },
  next_due: { type: Date, default: null },
  next_due_meter: { type: Number, default: null },
  assigned_to_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  estimated_duration_hours: { type: Number, default: null },
  estimated_cost: { type: Schema.Types.Decimal128, default: null },
  sla_completion_hours: { type: Number, default: null },
  checklist_template: { type: Schema.Types.Mixed, default: [] },
  active: { type: Boolean, default: true },
});

preventiveScheduleSchema.index({ org_id: 1, asset_id: 1, active: 1 });

module.exports = mongoose.model('PreventiveSchedule', preventiveScheduleSchema, 'preventive_schedules');
