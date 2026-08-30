import { userDAO } from '../dao/user.dao.js';
export const userRepository = {
  create: (data) => userDAO.create(data),
  findById: (id) => userDAO.findById(id),
  findByEmail: (email) => userDAO.findByEmail(email),
  findAll: () => userDAO.findAll(),
  updateById: (id, data) => userDAO.updateById(id, data),
  deleteById: (id) => userDAO.deleteById(id),
};
