const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaceSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  space_type: { type: String, trim: true },
  available_for_booking: { type: Boolean, default: true },
  requires_approval: { type: Boolean, default: false },
  booking_config: { type: Schema.Types.Mixed, default: {} },
  amenities: { type: Schema.Types.Mixed, default: [] },
  accessibility: { type: Boolean, default: false },
  status: { type: String, trim: true, default: 'active' },
});

module.exports = mongoose.model('Space', spaceSchema, 'spaces');
