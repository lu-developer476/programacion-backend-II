import mongoose from 'mongoose';
import { HttpError } from '../utils/http-error.js';

export const notFoundHandler = (request, response) => {
  response.status(404).json({
    status: 'error',
    error: `Ruta no encontrada: ${request.method} ${request.originalUrl}`,
  });
};

export const errorHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error);

  if (error instanceof HttpError) {
    return response.status(error.statusCode).json({
      status: 'error',
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return response.status(400).json({
      status: 'error',
      error: 'Error de validación',
      details: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return response.status(400).json({
      status: 'error',
      error: 'El identificador recibido no es válido',
    });
  }

  if (error?.code === 11000) {
    return response.status(409).json({
      status: 'error',
      error: 'Ya existe un registro con ese valor único',
      details: error.keyValue,
    });
  }

  console.error(error);
  return response.status(500).json({
    status: 'error',
    error: 'Error interno del servidor',
  });
};
