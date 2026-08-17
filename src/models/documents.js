const mongoose = require('mongoose');
const { Schema } = mongoose;

const documentSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  owner_type: { type: String, required: true, trim: true },
  owner_id: { type: Schema.Types.ObjectId, required: true },
  document_type: { type: String, trim: true },
  file_name: { type: String, trim: true },
  mime_type: { type: String, trim: true },
  storage_provider: { type: String, trim: true },
  storage_key: { type: String, trim: true },
  checksum: { type: String, trim: true },
  immutable: { type: Boolean, default: false },
  uploaded_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  uploaded_at: { type: Date, default: Date.now },
});

documentSchema.index({ org_id: 1, owner_type: 1, owner_id: 1 });

module.exports = mongoose.model('Document', documentSchema, 'documents');
