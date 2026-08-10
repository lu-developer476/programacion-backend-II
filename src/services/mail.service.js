import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendRecoveryEmail = async (email, recoveryLink) => {
    const mailOptions = {
        from: 'E-commerce Profesional <no-reply@ecommerce.com>',
        to: email,
        subject: 'Restablecer tu contraseña',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>¿Olvidaste tu contraseña?</h2>
                <p>No pasa nada, hace clic en el botón de abajo para restablecerla. Este enlace expira en 1 hora.</p>
                <a href="${recoveryLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Restablecer Contraseña</a>
                <p style="margin-top: 20px; font-size: 12px; color: gray;">Si no solicitaste este cambio, podés ignorar este correo.</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};