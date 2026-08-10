import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGO_URL,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS
};