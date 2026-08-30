import { User } from './models/user.model.js';

export class UserDAO {
  create(data) { return User.create(data); }
  findById(id) { return User.findById(id); }
  findByEmail(email) { return User.findOne({ email }); }
  findAll() { return User.find().select('-password').populate('cart').lean(); }
  updateById(id, data) { return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('cart'); }
  deleteById(id) { return User.findByIdAndDelete(id); }
}
export const userDAO = new UserDAO();
