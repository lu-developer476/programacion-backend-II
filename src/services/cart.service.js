import { cartModel } from '../dao/models/cart.model.js';
import { productModel } from '../dao/models/product.model.js';
import { ticketModel } from '../dao/models/ticket.model.js';
import crypto from 'crypto';

export default class CartService {
    async purchaseCart(cartId, userEmail) {
        const cart = await cartModel.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        let totalAmount = 0;
        const failedProducts = []; // Sin stock

        // Recorremos los productos del carrito
        for (const item of cart.products) {
            const product = await productModel.findById(item.product._id);

            // ¿Hay stock?
            if (product && product.stock >= item.quantity) {
                // Restamos el stock en la base de datos
                product.stock -= item.quantity;
                await product.save();
                
                // Sumamos al total del ticket
                totalAmount += product.price * item.quantity;
            } else {
                // Si no hay stock, se guarda para dejarlo en el carrito
                failedProducts.push(item);
            }
        }

        // Si se logró comprar al menos un producto, generamos el ticket
        let ticket = null;
        if (totalAmount > 0) {
            ticket = await ticketModel.create({
                code: crypto.randomBytes(10).toString('hex').toUpperCase(),
                amount: totalAmount,
                purchaser: userEmail
            });
        }

        // Actualizamos el carrito para que solamente queden los productos que fallaron
        cart.products = failedProducts;
        await cart.save();

        // Devolvemos el ticket y el estado del carrito
        return {
            ticket,
            unprocessedProducts: failedProducts.map(p => p.product._id) // IDs de lo que no se pudo comprar
        };
    }
}