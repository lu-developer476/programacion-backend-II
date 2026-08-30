import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../dao/models/user.model.js';
import { Cart } from '../dao/models/cart.model.js';
import { config } from './config.js';
import { cookieExtractor } from '../utils/jwt.js';
import { createHash, isValidPassword } from '../utils/password.js';

export const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (request, email, password, done) => {
        try {
          const { first_name, last_name, age } = request.body;

          if (!first_name || !last_name || age === undefined || !email || !password) {
            return done(null, false, { message: 'Todos los campos son obligatorios' });
          }

          const normalizedEmail = email.toLowerCase().trim();
          const existingUser = await User.findOne({ email: normalizedEmail });

          if (existingUser) {
            return done(null, false, { message: 'El email ya está registrado' });
          }

          const cart = await Cart.create({ products: [] });

          try {
            const user = await User.create({
              first_name,
              last_name,
              email: normalizedEmail,
              age: Number(age),
              password: createHash(password),
              cart: cart._id,
              role: 'user',
            });

            return done(null, user);
          } catch (error) {
            await Cart.findByIdAndDelete(cart._id);
            throw error;
          }
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase().trim() });

          if (!user || !isValidPassword(password, user.password)) {
            return done(null, false, { message: 'Email o contraseña incorrectos' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    'current',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor,
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: config.jwtSecret,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.sub).populate('cart');

          if (!user) {
            return done(null, false, { message: 'El usuario del token ya no existe' });
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      },
    ),
  );
};
