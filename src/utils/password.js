import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * La consigna exige bcrypt.hashSync. La sal se genera para cada contraseña.
 */
export const createHash = (password) => {
  if (typeof password !== 'string' || password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }

  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));
};

export const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);
