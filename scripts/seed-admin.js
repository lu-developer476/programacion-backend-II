import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { Cart } from '../src/dao/models/cart.model.js';
import { User } from '../src/dao/models/user.model.js';
import { createHash } from '../src/utils/password.js';

const required = ['ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Faltan variables: ${missing.join(', ')}`);
  process.exit(1);
}

try {
  await connectDatabase();

  const email = process.env.ADMIN_EMAIL.toLowerCase().trim();
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'admin';
    existing.password = createHash(process.env.ADMIN_PASSWORD);
    await existing.save();
    console.log(`✅ Usuario ${email} actualizado como admin`);
  } else {
    const cart = await Cart.create({ products: [] });
    await User.create({
      first_name: process.env.ADMIN_FIRST_NAME || 'Admin',
      last_name: process.env.ADMIN_LAST_NAME || 'Principal',
      email,
      age: Number(process.env.ADMIN_AGE) || 30,
      password: createHash(process.env.ADMIN_PASSWORD),
      cart: cart._id,
      role: 'admin',
    });
    console.log(`✅ Administrador ${email} creado`);
  }
} catch (error) {
  console.error('❌ Error creando administrador:', error);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
