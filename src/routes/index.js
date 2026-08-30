import { Router } from 'express';
import cartsRouter from './carts.router.js';
import productsRouter from './products.router.js';
import sessionsRouter from './sessions.router.js';
import usersRouter from './users.router.js';
import eventsRouter from './events.router.js';
import ticketsRouter from './tickets.router.js';

const router = Router();
router.get('/health', (request, response) => response.json({ status: 'success', message: 'API funcionando' }));
router.use('/sessions', sessionsRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/events', eventsRouter);
router.use('/tickets', ticketsRouter);
export default router;
