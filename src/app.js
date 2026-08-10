import express from 'express';
import mongoose from 'mongoose';

import config from './config/config.js';
import SessionRouter from './routes/sessions.router.js';

const app = express();

app.use(express.json());

const sessionRouter = new SessionRouter();

app.use('/api/sessions', sessionRouter.getRouter());

mongoose.connect(config.mongoUrl)
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch(error => {
        console.error('Error conectando MongoDB:', error);
    });

app.listen(config.port, () => {
    console.log(`Servidor escuchando en puerto ${config.port}`);
});