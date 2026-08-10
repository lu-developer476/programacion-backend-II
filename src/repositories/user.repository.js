import UserDTO from '../dtos/user.dto.js';

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUserById(id) {
        const user = await this.dao.getById(id);
        return user ? new UserDTO(user) : null; 
    }

    async getUserByEmail(email) {
        return await this.dao.getByEmail(email);
    }

    async createUser(user) {
        return await this.dao.create(user);
    }

    async updateUser(id, user) {
        return await this.dao.update(id, user);
    }
}