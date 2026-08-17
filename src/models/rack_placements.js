const mongoose = require('mongoose');
const { Schema } = mongoose;

const rackPlacementSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  rack_location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  slot_position: { type: String, trim: true },
  weight_kg: { type: Number, default: null },
  placed_at: { type: Date, default: Date.now },
  removed_at: { type: Date, default: null },
});

module.exports = mongoose.model('RackPlacement', rackPlacementSchema, 'rack_placements');
