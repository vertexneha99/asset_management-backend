const mongoose = require('mongoose');
const { Schema } = mongoose;

const unitOfMeasureSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  code: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  description: { type: String, trim: true },
  is_standard: { type: Boolean, default: false },
});

unitOfMeasureSchema.index({ org_id: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('UnitOfMeasure', unitOfMeasureSchema, 'units_of_measure');
