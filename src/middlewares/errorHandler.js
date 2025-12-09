const logger = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, _next) => {
  logger.error('Erro:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Se for erro de validação (ajustar quando implementar validação)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Conflito',
      message: 'Registro já existe',
    });
  }

  // Se for erro operacional (nossos erros customizados)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: 'Erro na aplicação',
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Erro não esperado
  res.status(500).json({
    error: 'Erro interno do servidor',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Ocorreu um erro inesperado',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
module.exports.AppError = AppError;
