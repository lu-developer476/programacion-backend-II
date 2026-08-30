import dotenv from 'dotenv';
dotenv.config();

const requiredVariables = ['MONGO_URL', 'JWT_SECRET'];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);
if (missingVariables.length) throw new Error(`Faltan variables de entorno obligatorias: ${missingVariables.join(', ')}`);

export const config = Object.freeze({
  port: Number(process.env.PORT) || 8080,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  cookieName: process.env.COOKIE_NAME || 'coderCookieToken',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  mailFrom: process.env.MAIL_FROM || 'no-reply@example.com',
});
