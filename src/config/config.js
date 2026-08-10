import dotenv from 'dotenv';

dotenv.config();

export default {
    port: Number(process.env.PORT) || 8080,
    mongoUrl: process.env.MONGO_URL,
    jwtSecret: process.env.JWT_SECRET || 'backend-ii-development-secret',
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    resetTokenMinutes: Number(process.env.RESET_TOKEN_MINUTES) || 60
};
