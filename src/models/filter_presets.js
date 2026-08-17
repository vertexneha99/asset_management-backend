const mongoose = require('mongoose');
const { Schema } = mongoose;

const filterPresetSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    module: { type: String, trim: true },
    filter_group: { type: Schema.Types.Mixed, default: {} },
    is_default: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

filterPresetSchema.index({ org_id: 1, owner_id: 1, module: 1 });

module.exports = mongoose.model('FilterPreset', filterPresetSchema, 'filter_presets');
