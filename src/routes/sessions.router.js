import { Router } from 'express';
import passport from 'passport';
import { current, login, logout, register } from '../controllers/session.controller.js';
import { authenticateCurrent } from '../middlewares/auth.middleware.js';

const router = Router();

const passportLocal = (strategy) => (request, response, next) => {
  passport.authenticate(strategy, { session: false }, (error, user, info) => {
    if (error) return next(error);
    if (!user) {
      return response.status(401).json({
        status: 'error',
        error: info?.message || 'No fue posible autenticar al usuario',
      });
    }

    request.user = user;
    return next();
  })(request, response, next);
};

router.post('/register', passportLocal('register'), register);
router.post('/login', passportLocal('login'), login);
router.get('/current', authenticateCurrent, current);
router.post('/logout', logout);

export default router;
