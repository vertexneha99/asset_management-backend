const mongoose = require('mongoose');
const { Schema } = mongoose;

const approvalTemplateSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true, trim: true },
    applicable_entity_types: { type: Schema.Types.Mixed, default: [] },
    department_scope: { type: Schema.Types.Mixed, default: [] },
    asset_category_scope: { type: Schema.Types.Mixed, default: [] },
    conditions: { type: Schema.Types.Mixed, default: {} },
    mandatory_rules: { type: Schema.Types.Mixed, default: {} },
    steps: { type: Schema.Types.Mixed, default: [] },
    version: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

module.exports = mongoose.model('ApprovalTemplate', approvalTemplateSchema, 'approval_templates');
