import { productService } from '../services/product.service.js';
export const getProducts = async (req, res) => { const result = await productService.list(req.query); res.json({ status: 'success', payload: result.products, pagination: result.pagination }); };
export const getProductById = async (req, res) => res.json({ status: 'success', payload: await productService.get(req.params.pid) });
export const createProduct = async (req, res) => res.status(201).json({ status: 'success', payload: await productService.create(req.body) });
export const updateProduct = async (req, res) => res.json({ status: 'success', payload: await productService.update(req.params.pid, req.body) });
export const deleteProduct = async (req, res) => { await productService.remove(req.params.pid); res.json({ status: 'success', message: 'Producto eliminado correctamente' }); };
