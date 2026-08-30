import { Event } from './models/event.model.js';

export class EventDAO {
  create(data) { return Event.create(data); }
  findAll(filter = {}) { return Event.find(filter).populate('organizer', 'first_name last_name email role').lean(); }
  findById(id) { return Event.findById(id).populate('organizer', 'first_name last_name email role'); }
  updateById(id, data) { return Event.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('organizer', 'first_name last_name email role'); }
  deleteById(id) { return Event.findByIdAndDelete(id); }
  countTickets(id) { return import('./models/ticket.model.js').then(({ Ticket }) => Ticket.countDocuments({ event: id, status: 'confirmed' })); }
  reserveSlot(id) { return Event.findOneAndUpdate({ _id: id, status: 'scheduled', $expr: { $lt: ['$reserved', '$capacity'] } }, { $inc: { reserved: 1 } }, { new: true }); }
  releaseSlot(id) { return Event.findOneAndUpdate({ _id: id, reserved: { $gt: 0 } }, { $inc: { reserved: -1 } }, { new: true }); }
}
export const eventDAO = new EventDAO();
