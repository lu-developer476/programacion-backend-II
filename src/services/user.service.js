import { userRepository } from '../repositories/user.repository.js';
import { cartRepository } from '../repositories/cart.repository.js';
import { createHash } from '../utils/password.js';
import { sanitizeUser } from '../utils/sanitize.js';
import { HttpError } from '../utils/http-error.js';

const normalizeEmail = (email) => email.toLowerCase().trim();

export const userService = {
  async create(data) {
    const { first_name, last_name, email, age, password, role = 'user' } = data;
    if (!first_name || !last_name || !email || age === undefined || !password) {
      throw new HttpError(400, 'Todos los campos obligatorios deben estar completos');
    }
    if (!Number.isInteger(Number(age)) || Number(age) < 0) throw new HttpError(400, 'La edad debe ser un entero válido');
    const normalizedEmail = normalizeEmail(email);
    if (await userRepository.findByEmail(normalizedEmail)) throw new HttpError(409, 'El email ya está registrado');
    const cart = await cartRepository.create({ products: [] });
    try {
      const user = await userRepository.create({ first_name, last_name, email: normalizedEmail, age: Number(age), password: createHash(password), cart: cart._id, role });
      return sanitizeUser(user);
    } catch (error) {
      await cartRepository.deleteById(cart._id);
      throw error;
    }
  },
  async list() { return userRepository.findAll(); },
  async get(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    return sanitizeUser(user);
  },
  async update(id, data, currentUser) {
    const allowed = ['first_name', 'last_name', 'email', 'age', 'password'];
    const updates = Object.fromEntries(allowed.filter((key) => data[key] !== undefined).map((key) => [key, data[key]]));
    if (updates.email) updates.email = normalizeEmail(updates.email);
    if (updates.age !== undefined && (!Number.isInteger(Number(updates.age)) || Number(updates.age) < 0)) throw new HttpError(400, 'La edad debe ser un entero válido');
    if (updates.password) updates.password = createHash(updates.password);
    if (currentUser.role === 'admin' && data.role !== undefined) updates.role = data.role;
    const user = await userRepository.updateById(id, updates);
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    return sanitizeUser(user);
  },
  async remove(id) {
    const user = await userRepository.deleteById(id);
    if (!user) throw new HttpError(404, 'Usuario no encontrado');
    await cartRepository.deleteById(user.cart);
  },
};
