import passport from 'passport';

export const authenticateCurrent = (request, response, next) => {
  passport.authenticate('current', { session: false }, (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      return response.status(401).json({
        status: 'error',
        error: info?.message || 'Token inválido o inexistente',
      });
    }

    request.user = user;
    return next();
  })(request, response, next);
};

export const authorizeRoles = (...allowedRoles) => (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({ status: 'error', error: 'No autenticado' });
  }

  if (!allowedRoles.includes(request.user.role)) {
    return response.status(403).json({
      status: 'error',
      error: 'No tenés permisos para realizar esta acción',
    });
  }

  return next();
};

export const authorizeOwnerOrAdmin = (request, response, next) => {
  const requestedUserId = request.params.uid;
  const currentUserId = request.user?._id?.toString();

  if (request.user?.role === 'admin' || currentUserId === requestedUserId) {
    return next();
  }

  return response.status(403).json({
    status: 'error',
    error: 'Solo podés administrar tu propio usuario',
  });
};

export const authorizeCartOwnerOrAdmin = (request, response, next) => {
  const requestedCartId = request.params.cid;
  const currentCart = request.user?.cart?._id || request.user?.cart;

  if (
    request.user?.role === 'admin' ||
    currentCart?.toString() === requestedCartId
  ) {
    return next();
  }

  return response.status(403).json({
    status: 'error',
    error: 'No tenés permisos para modificar este carrito',
  });
};
