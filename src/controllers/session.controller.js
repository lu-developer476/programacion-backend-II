import { config } from '../config/config.js';
import { generateToken } from '../utils/jwt.js';
import { sanitizeUser } from '../utils/sanitize.js';

const tokenCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.nodeEnv === 'production',
  maxAge: 60 * 60 * 1000,
};

export const register = (request, response) => {
  response.status(201).json({
    status: 'success',
    message: 'Usuario registrado correctamente',
    payload: sanitizeUser(request.user),
  });
};

export const login = (request, response) => {
  const token = generateToken(request.user);

  response.cookie(config.cookieName, token, tokenCookieOptions);
  response.json({
    status: 'success',
    message: 'Login exitoso',
    token,
    payload: sanitizeUser(request.user),
  });
};

export const current = (request, response) => {
  response.json({
    status: 'success',
    payload: sanitizeUser(request.user),
  });
};

export const logout = (request, response) => {
  response.clearCookie(config.cookieName, tokenCookieOptions);
  response.json({ status: 'success', message: 'Sesión cerrada' });
};
