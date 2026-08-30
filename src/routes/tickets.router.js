import { Router } from 'express';
import { authenticateCurrent } from '../middlewares/auth.middleware.js';
import { getMyTickets, cancelTicket } from '../controllers/ticket.controller.js';
const router = Router();
router.use(authenticateCurrent);
router.get('/mine', getMyTickets);
router.patch('/:tid/cancel', cancelTicket);
export default router;
