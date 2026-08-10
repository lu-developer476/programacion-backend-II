import CustomRouter from './router.js';
import { userModel } from '../dao/models/user.model.js';
import UserRepository from '../repositories/user.repository.js';
import UserMongoDAO from '../dao/mongo/user.dao.js';
import jwt from 'jsonwebtoken';

// Inicializamos el repositorio de usuarios pasando su DAO
const userDAO = new UserMongoDAO();
const userRepository = new UserRepository(userDAO);

export default class SessionRouter extends CustomRouter {
    init() {
        // 1. RUTA /current
        this.get('/current', ['USER', 'ADMIN'], async (req, res) => {
            try {
                // Buscamos al usuario usando el Repositorio
                const userLimpio = await userRepository.getUserById(req.user.id);
                
                if (!userLimpio) return res.sendUserError('Usuario no encontrado');
                
                // Usamos la respuesta estandarizada que creamos en el Router Padre
                res.sendSuccess(userLimpio);
            } catch (error) {
                res.sendServerError(error.message);
            }
        });

        // 2. RUTA DE LOGIN SIMULADO
        this.post('/login', ['PUBLIC'], async (req, res) => {
            const { email, password } = req.body;
            try {
                // Buscamos el usuario completo para validar credenciales
                const user = await userModel.findOne({ email });
                if (!user) return res.status(401).json({ status: "error", error: "Credenciales inválidas" });

                const token = jwt.sign(
                    { id: user._id, email: user.email, role: user.role }, 
                    process.env.JWT_SECRET || 'secretKey', 
                    { expiresIn: '24h' }
                );

                res.sendSuccess({ message: "Logueado con éxito", token });
            } catch (error) {
                res.sendServerError(error.message);
            }
        });
    }
}