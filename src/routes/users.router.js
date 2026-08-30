import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/user.controller.js';
import {
  authenticateCurrent,
  authorizeOwnerOrAdmin,
  authorizeRoles,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticateCurrent);
router.post('/', authorizeRoles('admin'), createUser);
router.get('/', authorizeRoles('admin'), getUsers);
router.get('/:uid', authorizeOwnerOrAdmin, getUserById);
router.put('/:uid', authorizeOwnerOrAdmin, updateUser);
router.delete('/:uid', authorizeOwnerOrAdmin, deleteUser);

export default router;
