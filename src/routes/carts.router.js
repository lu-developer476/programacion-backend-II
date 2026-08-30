import { Router } from 'express';
import {
  addProductToCart,
  clearCart,
  createCart,
  getCartById,
  removeProductFromCart,
  replaceCartProducts,
  updateProductQuantity,
} from '../controllers/cart.controller.js';
import {
  authenticateCurrent,
  authorizeCartOwnerOrAdmin,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', createCart);
router.use('/:cid', authenticateCurrent, authorizeCartOwnerOrAdmin);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.put('/:cid/products', replaceCartProducts);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid/products/:pid', removeProductFromCart);
router.delete('/:cid', clearCart);

export default router;
