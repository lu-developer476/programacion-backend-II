export default class CartRepository {
    constructor(dao) { this.dao = dao; }
    getById(id) { return this.dao.getById(id); }
    create(data) { return this.dao.create(data); }
    update(id, data) { return this.dao.update(id, data); }
}
