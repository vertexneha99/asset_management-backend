const mongoose = require('mongoose');
const { Schema } = mongoose;

const customFieldDefinitionSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'AssetCategory', required: true },
    field_key: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    field_type: { type: String, required: true, trim: true },
    options: { type: Schema.Types.Mixed, default: null },
    required: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false },
    version: { type: Number, default: 1 },
    applies_from: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

customFieldDefinitionSchema.index({ org_id: 1, category_id: 1, field_key: 1 }, { unique: true });

module.exports = mongoose.model('CustomFieldDefinition', customFieldDefinitionSchema, 'custom_field_definitions');
