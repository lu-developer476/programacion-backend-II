import { productRepository } from '../repositories/product.repository.js';
import { HttpError } from '../utils/http-error.js';

export const productService = {
  async list(query) {
    const { category, status, limit = 20, page = 1, sort } = query;
    const filter = {};
    if (category) filter.category = category;
    if (status !== undefined) filter.status = status === 'true';
    const numericLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const numericPage = Math.max(Number(page) || 1, 1);
    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
    const [products, total] = await productRepository.findPaginated(filter, { page: numericPage, limit: numericLimit, sort: sortOption });
    return { products, pagination: { total, page: numericPage, limit: numericLimit, totalPages: Math.ceil(total / numericLimit) } };
  },
  async get(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new HttpError(404, 'Producto no encontrado');
    return product;
  },
  create(data) { return productRepository.create(data); },
  async update(id, data) {
    const product = await productRepository.updateById(id, data);
    if (!product) throw new HttpError(404, 'Producto no encontrado');
    return product;
  },
  async remove(id) {
    const product = await productRepository.deleteById(id);
    if (!product) throw new HttpError(404, 'Producto no encontrado');
  },
};
