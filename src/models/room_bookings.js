const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomBookingSchema = new Schema(
  {
    org_id: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    space_id: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
    booked_by_employee_id: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    start_datetime: { type: Date, required: true },
    end_datetime: { type: Date, required: true },
    title: { type: String, trim: true },
    purpose: { type: String, trim: true },
    attendees: { type: Schema.Types.Mixed, default: [] },
    equipment_requested: { type: Schema.Types.Mixed, default: [] },
    recurrence: { type: Schema.Types.Mixed, default: null },
    booking_status: { type: String, trim: true, default: 'confirmed' },
    approval_status: { type: String, trim: true, default: 'pending' },
    approved_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    cancellation_reason: { type: String, trim: true },
    actual_start_time: { type: Date, default: null },
    actual_end_time: { type: Date, default: null },
    feedback_rating: { type: Number, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

module.exports = mongoose.model('RoomBooking', roomBookingSchema, 'room_bookings');
