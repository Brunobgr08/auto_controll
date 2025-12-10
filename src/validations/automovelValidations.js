const { body, param, query } = require('express-validator');
const { VALIDATION, LIMITS } = require('../constants/app');

const criarAutomovelValidation = [
  body('placa')
    .notEmpty()
    .withMessage('Placa é obrigatória')
    .isString()
    .withMessage('Placa deve ser uma string')
    .trim()
    .isLength({ min: 7, max: 7 })
    .withMessage('Placa deve ter 7 caracteres')
    .matches(VALIDATION.PLACA_REGEX)
    .withMessage('Placa no formato inválido (ex: ABC1D23)'),

  body('cor')
    .notEmpty()
    .withMessage('Cor é obrigatória')
    .isString()
    .withMessage('Cor deve ser uma string')
    .trim()
    .isLength({ min: LIMITS.COR_MIN, max: LIMITS.COR_MAX })
    .withMessage(
      `Cor deve ter entre ${LIMITS.COR_MIN} e ${LIMITS.COR_MAX} caracteres`
    ),

  body('marca')
    .notEmpty()
    .withMessage('Marca é obrigatória')
    .isString()
    .withMessage('Marca deve ser uma string')
    .trim()
    .isLength({ min: LIMITS.MARCA_MIN, max: LIMITS.MARCA_MAX })
    .withMessage(
      `Marca deve ter entre ${LIMITS.MARCA_MIN} e ${LIMITS.MARCA_MAX} caracteres`
    ),
];

const atualizarAutomovelValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(VALIDATION.ID_REGEX)
    .withMessage('ID deve conter apenas números'),

  body('placa')
    .optional()
    .isString()
    .withMessage('Placa deve ser uma string')
    .trim()
    .isLength({ min: 7, max: 7 })
    .withMessage('Placa deve ter 7 caracteres')
    .matches(VALIDATION.PLACA_REGEX)
    .withMessage('Placa no formato inválido (ex: ABC1D23)'),

  body('cor')
    .optional()
    .isString()
    .withMessage('Cor deve ser uma string')
    .trim()
    .isLength({ min: LIMITS.COR_MIN, max: LIMITS.COR_MAX })
    .withMessage(
      `Cor deve ter entre ${LIMITS.COR_MIN} e ${LIMITS.COR_MAX} caracteres`
    ),

  body('marca')
    .optional()
    .isString()
    .withMessage('Marca deve ser uma string')
    .trim()
    .isLength({ min: LIMITS.MARCA_MIN, max: LIMITS.MARCA_MAX })
    .withMessage(
      `Marca deve ter entre ${LIMITS.MARCA_MIN} e ${LIMITS.MARCA_MAX} caracteres`
    ),
];

const idValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(VALIDATION.ID_REGEX)
    .withMessage('ID deve conter apenas números'),
];

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
