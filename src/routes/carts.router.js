import mongoose from 'mongoose';
import crypto from 'crypto';

import CustomRouter from './router.js';
import CartMongoDAO from '../dao/mongo/cart.dao.js';
import CartRepository from '../repositories/cart.repository.js';
import { cartModel } from '../dao/models/cart.model.js';
import { productModel } from '../dao/models/product.model.js';
import { userModel } from '../dao/models/user.model.js';
import { ticketModel } from '../dao/models/ticket.model.js';

const repository = new CartRepository(new CartMongoDAO());

export default class CartRouter extends CustomRouter {
    init() {
        this.post('/', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const cart = await repository.create({ products: [] });
                return res.sendSuccess(cart, 201);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.get('/:cid', ['USER', 'ADMIN'], async (req, res) => {
            try {
                if (!mongoose.isValidObjectId(req.params.cid)) return res.sendUserError('ID de carrito inválido');
                const cart = await repository.getById(req.params.cid);
                if (!cart) return res.sendUserError('Carrito no encontrado', 404);
                return res.sendSuccess(cart);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.post('/:cid/product/:pid', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const { cid, pid } = req.params;
                if (!mongoose.isValidObjectId(cid) || !mongoose.isValidObjectId(pid)) return res.sendUserError('ID inválido');
                const quantity = Math.max(1, Number(req.body.quantity) || 1);
                const product = await productModel.findById(pid);
                if (!product) return res.sendUserError('Producto no encontrado', 404);
                if (product.stock < quantity) return res.sendUserError('Stock insuficiente', 400);

                const cart = await cartModel.findById(cid);
                if (!cart) return res.sendUserError('Carrito no encontrado', 404);
                const item = cart.products.find(entry => entry.product.toString() === pid);
                if (item) item.quantity += quantity;
                else cart.products.push({ product: pid, quantity });
                await cart.save();
                return res.sendSuccess(await repository.getById(cid));
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.put('/:cid', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const products = req.body.products;
                if (!Array.isArray(products)) return res.sendUserError('products debe ser un array');
                const normalized = products.map(item => ({ product: item.product, quantity: Math.max(1, Number(item.quantity) || 1) }));
                const cart = await repository.update(req.params.cid, { products: normalized });
                if (!cart) return res.sendUserError('Carrito no encontrado', 404);
                return res.sendSuccess(cart);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.put('/:cid/product/:pid', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const quantity = Number(req.body.quantity);
                if (!Number.isInteger(quantity) || quantity < 1) return res.sendUserError('quantity debe ser un entero positivo');
                const cart = await cartModel.findById(req.params.cid);
                if (!cart) return res.sendUserError('Carrito no encontrado', 404);
                const item = cart.products.find(entry => entry.product.toString() === req.params.pid);
                if (!item) return res.sendUserError('Producto no está en el carrito', 404);
                item.quantity = quantity;
                await cart.save();
                return res.sendSuccess(await repository.getById(req.params.cid));
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.delete('/:cid/product/:pid', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const cart = await cartModel.findById(req.params.cid);
                if (!cart) return res.sendUserError('Carrito no encontrado', 404);
                cart.products = cart.products.filter(item => item.product.toString() !== req.params.pid);
                await cart.save();
                return res.sendSuccess(await repository.getById(req.params.cid));
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.delete('/:cid', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const cart = await repository.update(req.params.cid, { products: [] });
                if (!cart) return res.sendUserError('Carrito no encontrado', 404);
                return res.sendSuccess(cart);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.post('/:cid/purchase', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const cart = await repository.getById(req.params.cid);
                if (!cart) return res.sendUserError('Carrito no encontrado', 404);
                if (!cart.products.length) return res.sendUserError('El carrito está vacío');

                const purchased = [];
                const rejected = [];
                let total = 0;

                for (const item of cart.products) {
                    const product = await productModel.findOneAndUpdate(
                        { _id: item.product._id, stock: { $gte: item.quantity } },
                        { $inc: { stock: -item.quantity } },
                        { new: true }
                    );

                    if (!product) {
                        rejected.push({ product: item.product._id, quantity: item.quantity });
                        continue;
                    }

                    total += product.price * item.quantity;
                    purchased.push({ product: product._id, quantity: item.quantity });
                }

                const remaining = rejected;
                await cartModel.findByIdAndUpdate(req.params.cid, { products: remaining });

                if (!purchased.length) return res.sendUserError('No hay stock suficiente para completar la compra');

                const owner = await userModel.findOne({ cart: req.params.cid });
                const ticket = await ticketModel.create({
                    code: crypto.randomUUID(),
                    amount: total,
                    purchaser: owner?.email || req.user.email
                });

                return res.sendSuccess({ ticket, purchased, rejected });
            } catch (error) { return res.sendServerError(error.message); }
        });
    }
}
