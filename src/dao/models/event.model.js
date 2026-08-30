import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    capacity: { type: Number, required: true, min: 1 },
    reserved: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['scheduled', 'cancelled'], default: 'scheduled', index: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true },
  },
  { timestamps: true },
);
eventSchema.index({ date: 1, status: 1 });
export const Event = mongoose.model('events', eventSchema);
