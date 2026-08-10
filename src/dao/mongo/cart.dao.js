import { cartModel } from '../models/cart.model.js';

export default class CartMongoDAO {
    async getById(id) { return cartModel.findById(id).populate('products.product'); }
    async create(data = {}) { return cartModel.create(data); }
    async update(id, data) { return cartModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('products.product'); }
}
