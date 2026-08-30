import { Ticket } from './models/ticket.model.js';

export class TicketDAO {
  create(data) { return Ticket.create(data); }
  findById(id) { return Ticket.findById(id).populate('event').populate('user', 'first_name last_name email'); }
  findByUser(userId) { return Ticket.find({ user: userId }).populate('event').sort({ createdAt: -1 }); }
  findByEvent(eventId) { return Ticket.find({ event: eventId, status: 'confirmed' }).populate('user', 'first_name last_name email'); }
  exists(eventId, userId) { return Ticket.exists({ event: eventId, user: userId, status: 'confirmed' }); }
  cancelById(id) { return Ticket.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true }).populate('event').populate('user', 'first_name last_name email'); }
}
export const ticketDAO = new TicketDAO();
