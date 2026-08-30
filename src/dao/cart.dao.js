import { Cart } from './models/cart.model.js';

export class CartDAO {
  create(data = {}) { return Cart.create(data); }
  findById(id, populate = false) {
    const query = Cart.findById(id);
    return populate ? query.populate('products.product') : query;
  }
  updateById(id, data) {
    return Cart.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('products.product');
  }
  deleteById(id) { return Cart.findByIdAndDelete(id); }
}
export const cartDAO = new CartDAO();
