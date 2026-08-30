import { ticketService } from '../services/ticket.service.js';
import { ticketDTO } from '../dto/ticket.dto.js';
export const createTicket = async (req, res) => res.status(201).json({ status: 'success', payload: ticketDTO(await ticketService.create(req.params.eid, req.user)) });
export const getMyTickets = async (req, res) => res.json({ status: 'success', payload: (await ticketService.listMine(req.user._id)).map(ticketDTO) });
export const getEventTickets = async (req, res) => res.json({ status: 'success', payload: (await ticketService.listByEvent(req.params.eid)).map(ticketDTO) });
export const cancelTicket = async (req, res) => res.json({ status: 'success', payload: ticketDTO(await ticketService.cancel(req.params.tid, req.user)) });
