import { recoveryTokenModel } from '../dao/models/recoveryToken.model.js';
import { userModel } from '../dao/models/user.model.js';
import { isValidPassword, createHash } from '../utils/crypto.util.js';
import crypto from 'crypto';

export default class AuthService {
    
    // Generar el token y simular el proceso de envío
    async generateRecoveryToken(email) {
        // Verificamos si el usuario existe en el e-commerce
        const user = await userModel.findOne({ email });
        if (!user) throw new Error('El usuario no existe');

        // Creamos un token aleatorio único
        const token = crypto.randomBytes(20).toString('hex');
        
        // Lo guardamos en la base de datos (se borra en 1 hora)
        await recoveryTokenModel.create({ email, token });

        // Devolvemos el token para armar el link en el controlador
        return token;
    }

    // Aplicar el cambio de contraseña con las validaciones de la consigna
    async resetPassword(token, newPassword) {
        // Buscamos si el token todavía existe y es válido (si pasó la hora, ya no estará)
        const tokenDoc = await recoveryTokenModel.findOne({ token });
        if (!tokenDoc) throw new Error('El enlace de recuperación expiró o es inválido');

        // Buscamos al usuario dueño de ese token
        const user = await userModel.findOne({ email: tokenDoc.email });
        if (!user) throw new Error('Usuario no encontrado');

        // VALIDACIÓN
        if (isValidPassword(user, newPassword)) {
            throw new Error('No podés usar la misma contraseña que ya tenías');
        }

        // Si es una contraseña nueva, la hasheamos y la actualizamos
        user.password = createHash(newPassword);
        await user.save();

        // Borramos el token para que no se pueda volver a usar
        await recoveryTokenModel.deleteOne({ _id: tokenDoc._id });

        return { message: 'Contraseña actualizada con éxito' };
    }
}