import { userModel } from '../models/user.model.js';

export default class UserMongoDAO {
    async get() { return userModel.find().populate('cart'); }
    async getById(id) { return userModel.findById(id).populate('cart'); }
    async getByEmail(email) { return userModel.findOne({ email }); }
    async create(user) { return userModel.create(user); }
    async update(id, user) { return userModel.findByIdAndUpdate(id, user, { new: true, runValidators: true }); }
    async delete(id) { return userModel.findByIdAndDelete(id); }
}
