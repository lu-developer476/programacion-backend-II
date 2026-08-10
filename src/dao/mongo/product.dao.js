import { productModel } from '../models/product.model.js';

export default class ProductMongoDAO {
    async get({ page = 1, limit = 10, sort, category, availability } = {}) {
        const currentPage = Math.max(1, Number(page));
        const pageSize = Math.max(1, Number(limit));
        const filter = {};

        if (category) filter.category = category;
        if (availability !== undefined) filter.stock = availability === 'true' ? { $gt: 0 } : 0;

        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const total = await productModel.countDocuments(filter);
        const products = await productModel.find(filter)
            .sort(sortOption)
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        return {
            docs: products,
            totalDocs: total,
            limit: pageSize,
            page: currentPage,
            totalPages,
            hasPrevPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
            prevPage: currentPage > 1 ? currentPage - 1 : null,
            nextPage: currentPage < totalPages ? currentPage + 1 : null
        };
    }

    async getById(id) { return productModel.findById(id); }
    async create(product) { return productModel.create(product); }
    async update(id, product) { return productModel.findByIdAndUpdate(id, product, { new: true, runValidators: true }); }
    async delete(id) { return productModel.findByIdAndDelete(id); }
}
