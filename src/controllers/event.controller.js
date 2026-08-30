import { eventService } from '../services/event.service.js';
import { eventDTO } from '../dto/event.dto.js';
export const createEvent = async (req, res) => res.status(201).json({ status: 'success', payload: eventDTO(await eventService.create(req.body, req.user)) });
export const getEvents = async (req, res) => res.json({ status: 'success', payload: (await eventService.list(req.query)).map(eventDTO) });
export const getEventById = async (req, res) => res.json({ status: 'success', payload: eventDTO(await eventService.get(req.params.eid)) });
export const updateEvent = async (req, res) => res.json({ status: 'success', payload: eventDTO(await eventService.update(req.params.eid, req.body, req.user)) });
export const cancelEvent = async (req, res) => res.json({ status: 'success', payload: eventDTO(await eventService.cancel(req.params.eid, req.user)) });
