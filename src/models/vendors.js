const mongoose = require('mongoose');
const { Schema } = mongoose;

const vendorSchema = new Schema({
  org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  name: { type: String, required: true, trim: true },
  contact_person: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  gst_number: { type: String, trim: true },
  bank_details_encrypted: { type: String, select: false },
  categories_supplied: { type: Schema.Types.Mixed, default: [] },
  rating: { type: Number, default: null },
  blacklisted: { type: Boolean, default: false },
  blacklist_reason: { type: String, trim: true },
  address: { type: String, trim: true },
  status: { type: String, trim: true, default: 'active' },
  onboarded_on: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

vendorSchema.index({ org_id: 1, name: 1 });

module.exports = mongoose.model('Vendor', vendorSchema, 'vendors');
