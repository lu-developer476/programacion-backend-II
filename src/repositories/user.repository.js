import UserDTO from '../dtos/user.dto.js';

export default class UserRepository {
    constructor(dao) { this.dao = dao; }

    async getAll() {
        const users = await this.dao.get();
        return users.map(user => new UserDTO(user));
    }

    async getUserById(id) {
        const user = await this.dao.getById(id);
        return user ? new UserDTO(user) : null;
    }

    async getUserByEmail(email) { return this.dao.getByEmail(email); }
    async createUser(user) { return this.dao.create(user); }
    async updateUser(id, user) { return this.dao.update(id, user); }
    async deleteUser(id) { return this.dao.delete(id); }
}
