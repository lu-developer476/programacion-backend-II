import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import CustomRouter from './router.js';
import { userModel } from '../dao/models/user.model.js';
import { cartModel } from '../dao/models/cart.model.js';
import UserDTO from '../dtos/user.dto.js';
import config from '../config/config.js';

const SALT_ROUNDS = 10;

export default class SessionRouter extends CustomRouter {
    init() {
        this.post('/register', ['PUBLIC'], async (req, res) => {
            try {
                const { first_name, last_name, email, age, password } = req.body;
                if (!first_name || !last_name || !email || age === undefined || !password) {
                    return res.sendUserError('Todos los campos obligatorios deben estar completos');
                }
                if (password.length < 6) return res.sendUserError('La contraseña debe tener al menos 6 caracteres');

                const normalizedEmail = email.trim().toLowerCase();
                if (await userModel.exists({ email: normalizedEmail })) return res.sendUserError('El email ya está registrado', 409);

                const cart = await cartModel.create({ products: [] });
                const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
                const user = await userModel.create({
                    first_name,
                    last_name,
                    email: normalizedEmail,
                    age: Number(age),
                    password: hashedPassword,
                    role: 'user',
                    cart: cart._id,
                    previousPasswords: [hashedPassword]
                });

                return res.sendSuccess(new UserDTO(user), 201);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.post('/login', ['PUBLIC'], async (req, res) => {
            try {
                const { email, password } = req.body;
                const user = await userModel.findOne({ email: email?.trim().toLowerCase() });
                if (!user || !(await bcrypt.compare(password || '', user.password))) return res.sendUserError('Credenciales inválidas', 401);

                const token = jwt.sign(
                    { id: user._id.toString(), email: user.email, role: user.role },
                    config.jwtSecret,
                    { expiresIn: '24h' }
                );
                return res.sendSuccess({ token, user: new UserDTO(user) });
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.get('/current', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const user = await userModel.findById(req.user.id).populate('cart');
                if (!user) return res.sendUserError('Usuario no encontrado', 404);
                return res.sendSuccess(new UserDTO(user));
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.post('/forgot-password', ['PUBLIC'], async (req, res) => {
            try {
                const email = req.body.email?.trim().toLowerCase();
                const user = await userModel.findOne({ email });
                if (!user) return res.sendUserError('No existe un usuario con ese email', 404);

                const rawToken = crypto.randomBytes(32).toString('hex');
                user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
                user.resetPasswordExpires = new Date(Date.now() + config.resetTokenMinutes * 60 * 1000);
                await user.save();

                if (config.mailUser && config.mailPass) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: { user: config.mailUser, pass: config.mailPass }
                    });
                    await transporter.sendMail({
                        from: config.mailUser,
                        to: user.email,
                        subject: 'Recuperación de contraseña',
                        text: `Tu token de recuperación es: ${rawToken}. Expira en ${config.resetTokenMinutes} minutos.`
                    });
                    return res.sendSuccess({ message: 'Se envió un correo de recuperación' });
                }

                return res.sendSuccess({ message: 'Modo desarrollo: configurá MAIL_USER y MAIL_PASS para enviar el correo', devToken: rawToken, expiresInMinutes: config.resetTokenMinutes });
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.post('/reset-password', ['PUBLIC'], async (req, res) => {
            try {
                const { token, password } = req.body;
                if (!token || !password || password.length < 6) return res.sendUserError('Token y una contraseña válida son obligatorios');

                const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
                const user = await userModel.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: new Date() } });
                if (!user) return res.sendUserError('Token inválido o expirado', 401);

                for (const previousHash of user.previousPasswords) {
                    if (await bcrypt.compare(password, previousHash)) return res.sendUserError('No podés reutilizar una contraseña anterior');
                }

                const newHash = await bcrypt.hash(password, SALT_ROUNDS);
                user.password = newHash;
                user.previousPasswords = [...user.previousPasswords.slice(-4), newHash];
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                await user.save();
                return res.sendSuccess({ message: 'Contraseña actualizada correctamente' });
            } catch (error) { return res.sendServerError(error.message); }
        });
    }
}
