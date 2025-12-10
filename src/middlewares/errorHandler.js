const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../constants/app');

class AppError extends Error {
  constructor(
    message,
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details = null
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, HTTP_STATUS.BAD_REQUEST, details);
  }
}

class NotFoundError extends AppError {
  constructor(message, details = null) {
    super(message, HTTP_STATUS.NOT_FOUND, details);
  }
}

class ConflictError extends AppError {
  constructor(message, details = null) {
    super(message, HTTP_STATUS.CONFLICT, details);
  }
}

const errorHandler = (err, req, res, _next) => {
  // Log do erro
  logger.error('Erro na requisição', {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Se for erro de validação do express-validator
  if (err.name === 'ValidationError' || Array.isArray(err.errors)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Erro de validação',
      message: 'Dados inválidos fornecidos',
      details: err.errors || err.details,
      timestamp: new Date().toISOString(),
    });
  }

  // Se for erro de sintaxe JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Erro de sintaxe JSON',
      message: 'JSON malformado',
      timestamp: new Date().toISOString(),
    });
  }

  // Se for erro operacional (nossos erros customizados)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.name.replace('Error', ''),
      message: err.message,
      details: err.details,
      timestamp: err.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Erro não esperado - não expor detalhes em produção
  const response = {
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado',
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    response.debug = {
      message: err.message,
      stack: err.stack,
    };
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(response);
};

module.exports = {
  errorHandler,
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
};
