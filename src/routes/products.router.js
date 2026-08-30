import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/product.controller.js';
import { authenticateCurrent, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', authenticateCurrent, authorizeRoles('admin'), createProduct);
router.put('/:pid', authenticateCurrent, authorizeRoles('admin'), updateProduct);
router.delete('/:pid', authenticateCurrent, authorizeRoles('admin'), deleteProduct);

export default router;
