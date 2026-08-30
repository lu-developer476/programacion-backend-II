import { cartRepository } from '../repositories/cart.repository.js';
import { productRepository } from '../repositories/product.repository.js';
import { HttpError } from '../utils/http-error.js';

const getCartOrFail = async (id) => {
  const cart = await cartRepository.findById(id, true);
  if (!cart) throw new HttpError(404, 'Carrito no encontrado');
  return cart;
};
export const createCart = async (req, res) => res.status(201).json({ status: 'success', payload: await cartRepository.create({ products: [] }) });
export const getCartById = async (req, res) => res.json({ status: 'success', payload: await getCartOrFail(req.params.cid) });
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  if (!(await productRepository.exists(pid))) throw new HttpError(404, 'Producto no encontrado');
  const cart = await cartRepository.findById(cid);
  if (!cart) throw new HttpError(404, 'Carrito no encontrado');
  const item = cart.products.find((entry) => entry.product.toString() === pid);
  if (item) item.quantity += 1; else cart.products.push({ product: pid, quantity: 1 });
  await cart.save();
  await cart.populate('products.product');
  res.json({ status: 'success', payload: cart });
};
export const replaceCartProducts = async (req, res) => {
  if (!Array.isArray(req.body.products)) throw new HttpError(400, 'El body debe incluir un array products');
  const cart = await cartRepository.updateById(req.params.cid, { products: req.body.products });
  if (!cart) throw new HttpError(404, 'Carrito no encontrado');
  res.json({ status: 'success', payload: cart });
};
export const updateProductQuantity = async (req, res) => {
  const quantity = Number(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) throw new HttpError(400, 'quantity debe ser un entero mayor o igual a 1');
  const cart = await cartRepository.findById(req.params.cid);
  if (!cart) throw new HttpError(404, 'Carrito no encontrado');
  const item = cart.products.find((entry) => entry.product.toString() === req.params.pid);
  if (!item) throw new HttpError(404, 'El producto no está en el carrito');
  item.quantity = quantity; await cart.save(); await cart.populate('products.product');
  res.json({ status: 'success', payload: cart });
};
export const removeProductFromCart = async (req, res) => {
  const cart = await cartRepository.updateById(req.params.cid, { $pull: { products: { product: req.params.pid } } });
  if (!cart) throw new HttpError(404, 'Carrito no encontrado');
  res.json({ status: 'success', payload: cart });
};
export const clearCart = async (req, res) => {
  const cart = await cartRepository.updateById(req.params.cid, { products: [] });
  if (!cart) throw new HttpError(404, 'Carrito no encontrado');
  res.json({ status: 'success', payload: cart });
};
