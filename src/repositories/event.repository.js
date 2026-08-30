import { eventDAO } from '../dao/event.dao.js';
export const eventRepository = {
  create: (data) => eventDAO.create(data),
  findAll: (filter) => eventDAO.findAll(filter),
  findById: (id) => eventDAO.findById(id),
  updateById: (id, data) => eventDAO.updateById(id, data),
  deleteById: (id) => eventDAO.deleteById(id),
  countTickets: (id) => eventDAO.countTickets(id),
  reserveSlot: (id) => eventDAO.reserveSlot(id),
  releaseSlot: (id) => eventDAO.releaseSlot(id),
};
