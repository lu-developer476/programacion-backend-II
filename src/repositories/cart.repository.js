import { cartDAO } from '../dao/cart.dao.js';
export const cartRepository = {
  create: (data) => cartDAO.create(data),
  findById: (id, populate = false) => cartDAO.findById(id, populate),
  updateById: (id, data) => cartDAO.updateById(id, data),
  deleteById: (id) => cartDAO.deleteById(id),
};
