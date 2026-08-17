const mongoose = require('mongoose');
const { Schema } = mongoose;

const shiftSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true, trim: true },
  start_time: { type: String, trim: true },
  end_time: { type: String, trim: true },
  applicable_days: { type: Schema.Types.Mixed, default: [] },
  duty_manager_id: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Shift', shiftSchema, 'shifts');
