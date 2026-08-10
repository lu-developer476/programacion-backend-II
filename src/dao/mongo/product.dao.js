import { productModel } from '../models/product.model.js';

export default class ProductMongoDAO {
    async get({ page = 1, limit = 10, sort, category, availability } = {}) {
        const filter = {};
        if (category) filter.category = category;
        if (availability !== undefined) filter.stock = availability === 'true' ? { $gt: 0 } : 0;

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
        };

        return productModel.paginate(filter, options);
    }

    async getById(id) { return productModel.findById(id); }
    async create(product) { return productModel.create(product); }
    async update(id, product) { return productModel.findByIdAndUpdate(id, product, { new: true, runValidators: true }); }
    async delete(id) { return productModel.findByIdAndDelete(id); }
}
