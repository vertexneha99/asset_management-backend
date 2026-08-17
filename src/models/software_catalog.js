const mongoose = require('mongoose');
const { Schema } = mongoose;

const softwareCatalogSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  software_name: { type: String, required: true, trim: true },
  publisher: { type: String, trim: true },
  category: { type: String, trim: true },
  licensing_model: { type: String, trim: true },
  supported_versions: { type: Schema.Types.Mixed, default: [] },
  eol_date: { type: Date, default: null },
  compliance_notes: { type: String, trim: true },
});

softwareCatalogSchema.index({ org_id: 1, software_name: 1 }, { unique: true });

module.exports = mongoose.model('SoftwareCatalog', softwareCatalogSchema, 'software_catalog');
