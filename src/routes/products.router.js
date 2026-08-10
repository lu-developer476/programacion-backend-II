import mongoose from 'mongoose';
import CustomRouter from './router.js';
import ProductRepository from '../repositories/product.repository.js';

const repository = new ProductRepository();

export default class ProductRouter extends CustomRouter {
    init() {
        this.get('/', ['PUBLIC'], async (req, res) => {
            try {
                const result = await repository.getAll(req.query);
                const base = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
                const link = (page) => `${base}?${new URLSearchParams({ ...req.query, page }).toString()}`;
                return res.status(200).json({
                    status: 'success',
                    payload: result.docs,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage,
                    nextPage: result.nextPage,
                    page: result.page,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? link(result.prevPage) : null,
                    nextLink: result.hasNextPage ? link(result.nextPage) : null
                });
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.get('/:pid', ['PUBLIC'], async (req, res) => {
            try {
                if (!mongoose.isValidObjectId(req.params.pid)) return res.sendUserError('ID de producto inválido');
                const product = await repository.getById(req.params.pid);
                if (!product) return res.sendUserError('Producto no encontrado', 404);
                return res.sendSuccess(product);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.post('/', ['ADMIN'], async (req, res) => {
            try {
                const { title, description, price, stock, code, category } = req.body;
                if (!title || !description || price === undefined || stock === undefined || !code || !category) return res.sendUserError('Faltan campos obligatorios');
                const product = await repository.create({ title, description, price, stock, code, category });
                return res.sendSuccess(product, 201);
            } catch (error) {
                if (error.code === 11000) return res.sendUserError('El código de producto ya existe', 409);
                return res.sendServerError(error.message);
            }
        });

        this.put('/:pid', ['ADMIN'], async (req, res) => {
            try {
                if (!mongoose.isValidObjectId(req.params.pid)) return res.sendUserError('ID de producto inválido');
                delete req.body._id;
                delete req.body.code;
                const product = await repository.update(req.params.pid, req.body);
                if (!product) return res.sendUserError('Producto no encontrado', 404);
                return res.sendSuccess(product);
            } catch (error) { return res.sendServerError(error.message); }
        });

        this.delete('/:pid', ['ADMIN'], async (req, res) => {
            try {
                if (!mongoose.isValidObjectId(req.params.pid)) return res.sendUserError('ID de producto inválido');
                const product = await repository.delete(req.params.pid);
                if (!product) return res.sendUserError('Producto no encontrado', 404);
                return res.sendSuccess(product);
            } catch (error) { return res.sendServerError(error.message); }
        });
    }
}
