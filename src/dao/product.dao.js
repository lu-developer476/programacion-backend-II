import { Product } from './models/product.model.js';

export class ProductDAO {
  findPaginated(filter, { page, limit, sort }) {
    return Promise.all([
      Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
  }
  findById(id) { return Product.findById(id).lean(); }
  exists(id) { return Product.exists({ _id: id }); }
  create(data) { return Product.create(data); }
  updateById(id, data) { return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  deleteById(id) { return Product.findByIdAndDelete(id); }
}
export const productDAO = new ProductDAO();
