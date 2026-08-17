const mongoose = require('mongoose');
const { Schema } = mongoose;

const warrantySchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  asset_id: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  provider: { type: String, trim: true },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  coverage: { type: String, trim: true },
  type: { type: String, trim: true },
  contact_number: { type: String, trim: true },
  document_ref: { type: String, trim: true },
  status: { type: String, trim: true, default: 'active' },
});

warrantySchema.index({ org_id: 1, asset_id: 1 });

module.exports = mongoose.model('Warranty', warrantySchema, 'warranties');
