const mongoose = require('mongoose');
const { Schema } = mongoose;

const organizationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    legal_name: { type: String, trim: true },
    subscription_tier: { type: String, trim: true },
    active_asset_quota: { type: Number, default: 0 },
    active_asset_count: { type: Number, default: 0 },
    data_residency_region: { type: String, trim: true },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('Organization', organizationSchema, 'organizations');
