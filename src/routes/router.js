import { Router } from 'express';
import jwt from 'jsonwebtoken';

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

    // Middleware 1: Estandarizar respuestas
    generateCustomResponses(req, res, next) {
        res.sendSuccess = payload => res.json({ status: "success", payload });
        res.sendUserError = error => res.status(400).json({ status: "error", error });
        res.sendServerError = error => res.status(500).json({ status: "error", error });
        next();
    }

    // Middleware 2: Manejo de Políticas de Autorización con JWT
    handlePolicies(policies) {
        return (req, res, next) => {
            if (policies.includes('PUBLIC')) return next();

            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(401).json({ status: "error", error: "No autorizado - Token ausente" });

            const token = authHeader.split(' ')[1];

            try {
                const user = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
                req.user = user;
            } catch (error) {
                return res.status(401).json({ status: "error", error: "Token inválido o expirado" });
            }

            // Verificamos si el rol del usuario cumple con las políticas requeridas
            if (!policies.includes(req.user.role.toUpperCase())) {
                return res.status(403).json({ status: "error", error: "Prohibido - No tenés permisos" });
            }

            next();
        };
    }
}