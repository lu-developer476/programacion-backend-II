import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() {}

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
    }

    post(path, policies, ...callbacks) {
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
    }

    put(path, policies, ...callbacks) {
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, ...callbacks);
    }

    generateCustomResponses(req, res, next) {
        res.sendSuccess = (payload, status = 200) => res.status(status).json({ status: 'success', payload });
        res.sendUserError = (error, status = 400) => res.status(status).json({ status: 'error', error });
        res.sendServerError = (error) => res.status(500).json({ status: 'error', error });
        next();
    }

    handlePolicies(policies = ['PUBLIC']) {
        return (req, res, next) => {
            if (policies.includes('PUBLIC')) return next();

            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith('Bearer ')) {
                return res.status(401).json({ status: 'error', error: 'Token ausente o formato inválido' });
            }

            try {
                const token = authHeader.slice(7);
                req.user = jwt.verify(token, config.jwtSecret);
            } catch {
                return res.status(401).json({ status: 'error', error: 'Token inválido o expirado' });
            }

            if (!policies.includes(req.user.role?.toUpperCase())) {
                return res.status(403).json({ status: 'error', error: 'No tenés permisos para realizar esta operación' });
            }

            next();
        };
    }
}
