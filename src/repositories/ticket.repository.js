import { ticketDAO } from '../dao/ticket.dao.js';
export const ticketRepository = {
  create: (data) => ticketDAO.create(data),
  findById: (id) => ticketDAO.findById(id),
  findByUser: (id) => ticketDAO.findByUser(id),
  findByEvent: (id) => ticketDAO.findByEvent(id),
  exists: (eventId, userId) => ticketDAO.exists(eventId, userId),
  cancelById: (id) => ticketDAO.cancelById(id),
};
