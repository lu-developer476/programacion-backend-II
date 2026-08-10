export const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', error: 'No autorizado - No hay sesión activa' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ status: 'error', error: 'Acceso denegado - No tenés los permisos necesarios' });
        }

        next();
    };
};