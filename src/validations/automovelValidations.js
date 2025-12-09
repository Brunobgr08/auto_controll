const { body, param, query } = require('express-validator');

// Validações para criação
const criarAutomovelValidation = [
  body('placa')
    .notEmpty()
    .withMessage('Placa é obrigatória')
    .isString()
    .withMessage('Placa deve ser uma string')
    .trim()
    .isLength({ min: 7, max: 7 })
    .withMessage('Placa deve ter 7 caracteres')
    .matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i)
    .withMessage('Placa no formato inválido (ex: ABC1D23)'),

  body('cor')
    .notEmpty()
    .withMessage('Cor é obrigatória')
    .isString()
    .withMessage('Cor deve ser uma string')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Cor deve ter entre 3 e 50 caracteres'),

  body('marca')
    .notEmpty()
    .withMessage('Marca é obrigatória')
    .isString()
    .withMessage('Marca deve ser uma string')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Marca deve ter entre 2 e 50 caracteres'),
];

// Validações para atualização
const atualizarAutomovelValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(/^\d+$/)
    .withMessage('ID deve conter apenas números'),

  body('placa')
    .optional()
    .isString()
    .withMessage('Placa deve ser uma string')
    .trim()
    .isLength({ min: 7, max: 7 })
    .withMessage('Placa deve ter 7 caracteres')
    .matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i)
    .withMessage('Placa no formato inválido (ex: ABC1D23)'),

  body('cor')
    .optional()
    .isString()
    .withMessage('Cor deve ser uma string')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Cor deve ter entre 3 e 50 caracteres'),

  body('marca')
    .optional()
    .isString()
    .withMessage('Marca deve ser uma string')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Marca deve ter entre 2 e 50 caracteres'),
];

// Validações para ID
const idValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(/^\d+$/)
    .withMessage('ID deve conter apenas números'),
];

// Validações para listagem com filtros
const listarAutomoveisValidation = [
  query('cor')
    .optional()
    .isString()
    .withMessage('Cor deve ser uma string')
    .trim(),

  query('marca')
    .optional()
    .isString()
    .withMessage('Marca deve ser uma string')
    .trim(),
];

module.exports = {
  criarAutomovelValidation,
  atualizarAutomovelValidation,
  idValidation,
  listarAutomoveisValidation,
};
