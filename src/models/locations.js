const mongoose = require('mongoose');
const { Schema } = mongoose;
const { LOCATION_TYPE } = require('./enums');

const locationSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    type: { type: String, trim: true, enum: LOCATION_TYPE },
    code: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    parent_id: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    ancestors: { type: Schema.Types.Mixed, default: [] },
    address: { type: Schema.Types.Mixed, default: {} },
    geo: { type: Schema.Types.Mixed, default: {} },
    capacity: { type: Schema.Types.Mixed, default: {} },
    responsible_employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    status: { type: String, trim: true, default: 'active' },
    description: { type: String, trim: true },

    // Site-level
    city: { type: String, trim: true },
    country: { type: String, trim: true },

    // Building-level
    total_floors: { type: Number, default: null },
    total_rooms: { type: Number, default: null },

    // Floor-level
    floor_number: { type: Number, default: null },

    // Room-level
    room_type: { type: String, trim: true },
    department: { type: String, trim: true },
    responsible_person: { type: String, trim: true },
    contact_details: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

locationSchema.index({ org_id: 1, code: 1 }, { unique: true, partialFilterExpression: { code: { $exists: true , $type: 'string'} } });

module.exports = mongoose.model('Location', locationSchema, 'locations');
