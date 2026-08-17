const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    email: { type: String, required: true, trim: true, lowercase: true },
    password_hash: { type: String, select: false },
    avatar_url: { type: String, trim: true },
    auth_provider: { type: String, trim: true, default: 'local' },
    sso_subject: { type: String, trim: true },
    is_active: { type: Boolean, default: true },
    mfa_enabled: { type: Boolean, default: false },
    last_login_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

userSchema.index({ org_id: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema, 'users');
