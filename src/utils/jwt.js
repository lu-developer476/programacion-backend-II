import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const generateToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn },
  );

export const cookieExtractor = (request) => {
  if (!request?.cookies) return null;
  return request.cookies[config.cookieName] || null;
};
