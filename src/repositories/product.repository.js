import ProductMongoDAO from '../dao/mongo/product.dao.js';

export default class ProductRepository {
    constructor(dao = new ProductMongoDAO()) {
        this.dao = dao;
    }

    getAll(options) { return this.dao.get(options); }
    getById(id) { return this.dao.getById(id); }
    create(data) { return this.dao.create(data); }
    update(id, data) { return this.dao.update(id, data); }
    delete(id) { return this.dao.delete(id); }
}
