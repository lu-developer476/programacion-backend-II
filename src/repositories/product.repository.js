import { productDAO } from '../dao/product.dao.js';
export const productRepository = {
  findPaginated: (...args) => productDAO.findPaginated(...args),
  findById: (id) => productDAO.findById(id),
  exists: (id) => productDAO.exists(id),
  create: (data) => productDAO.create(data),
  updateById: (id, data) => productDAO.updateById(id, data),
  deleteById: (id) => productDAO.deleteById(id),
};
