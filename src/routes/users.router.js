import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import CustomRouter from './router.js';
import UserMongoDAO from '../dao/mongo/user.dao.js';
import UserRepository from '../repositories/user.repository.js';
import UserDTO from '../dtos/user.dto.js';

const repository = new UserRepository(new UserMongoDAO());

export default class UserRouter extends CustomRouter {
    init() {
        this.get('/', ['ADMIN'], async (req, res) => {
            try { return res.sendSuccess(await repository.getAll()); }
            catch (error) { return res.sendServerError(error.message); }
        });

        this.get('/:uid', ['ADMIN'], async (req, res) => {
            try {
                if (!mongoose.isValidObjectId(req.params.uid)) return res.sendUserError('ID de usuario inválido');
                const user = await repository.getUserById(req.params.uid);
                if (!user) return res.sendUserError('Usuario no encontrado', 404);
                return res.sendSuccess(user);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.post('/', ['ADMIN'], async (req, res) => {
            try {
                const { first_name, last_name, email, age, password, role = 'user' } = req.body;
                if (!first_name || !last_name || !email || age === undefined || !password) {
                    return res.sendUserError('Faltan campos obligatorios');
                }
                if (await repository.getUserByEmail(email.toLowerCase())) return res.sendUserError('Email ya registrado', 409);
                const hash = await bcrypt.hash(password, 10);
                const user = await repository.createUser({ first_name, last_name, email: email.toLowerCase(), age, password: hash, role });
                return res.sendSuccess(new UserDTO(user), 201);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.put('/:uid', ['ADMIN'], async (req, res) => {
            try {
                if (!mongoose.isValidObjectId(req.params.uid)) return res.sendUserError('ID de usuario inválido');
                const allowed = ['first_name', 'last_name', 'age', 'role'];
                const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
                if (data.role && !['user', 'admin'].includes(data.role)) return res.sendUserError('Rol inválido');
                const user = await repository.updateUser(req.params.uid, data);
                if (!user) return res.sendUserError('Usuario no encontrado', 404);
                return res.sendSuccess(new UserDTO(user));
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.delete('/:uid', ['ADMIN'], async (req, res) => {
            try {
                if (!mongoose.isValidObjectId(req.params.uid)) return res.sendUserError('ID de usuario inválido');
                const user = await repository.deleteUser(req.params.uid);
                if (!user) return res.sendUserError('Usuario no encontrado', 404);
                return res.sendSuccess({ message: 'Usuario eliminado', id: user._id });
            } catch (error) { return res.sendServerError(error.message); }
        });
    }
}
