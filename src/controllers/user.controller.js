import { userService } from '../services/user.service.js';
export const createUser = async (req, res) => res.status(201).json({ status: 'success', payload: await userService.create(req.body) });
export const getUsers = async (req, res) => res.json({ status: 'success', payload: await userService.list() });
export const getUserById = async (req, res) => res.json({ status: 'success', payload: await userService.get(req.params.uid) });
export const updateUser = async (req, res) => res.json({ status: 'success', payload: await userService.update(req.params.uid, req.body, req.user) });
export const deleteUser = async (req, res) => { await userService.remove(req.params.uid); res.json({ status: 'success', message: 'Usuario eliminado correctamente' }); };
