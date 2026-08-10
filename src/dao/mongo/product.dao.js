import { productModel } from '../models/product.model.js';

export default class ProductMongoDAO {
    async get() {
        return await productModel.find();
    }

    async getById(id) {
        return await productModel.findById(id);
    }

    async create(product) {
        return await productModel.create(product);
    }

    async update(id, product) {
        return await productModel.findByIdAndUpdate(id, product, { new: true });
    }

    async delete(id) {
        return await productModel.findByIdAndDelete(id);
    }
}