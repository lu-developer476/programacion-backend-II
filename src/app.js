import express from 'express';
import mongoose from 'mongoose';

import config from './config/config.js';
import SessionRouter from './routes/sessions.router.js';
import UserRouter from './routes/users.router.js';
import ProductRouter from './routes/products.router.js';
import CartRouter from './routes/carts.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'success', message: 'API online' });
});

app.use('/api/sessions', new SessionRouter().getRouter());
app.use('/api/users', new UserRouter().getRouter());
app.use('/api/products', new ProductRouter().getRouter());
app.use('/api/carts', new CartRouter().getRouter());

app.use((req, res) => {
    res.status(404).json({ status: 'error', error: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
});

async function startServer() {
    try {
        if (!config.mongoUrl) {
            throw new Error('Falta MONGO_URL en las variables de entorno');
        }

        await mongoose.connect(config.mongoUrl);
        console.log('Conectado a MongoDB');

        app.listen(config.port, () => {
            console.log(`Servidor escuchando en http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();
