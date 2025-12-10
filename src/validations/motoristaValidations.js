const { body, param, query } = require('express-validator');
const { VALIDATION, LIMITS } = require('../constants/app');

const criarMotoristaValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isString()
    .withMessage('Nome deve ser uma string')
    .trim()
    .isLength({ min: LIMITS.NOME_MIN, max: LIMITS.NOME_MAX })
    .withMessage(
      `Nome deve ter entre ${LIMITS.NOME_MIN} e ${LIMITS.NOME_MAX} caracteres`
    )
    .matches(VALIDATION.NOME_REGEX)
    .withMessage('Nome deve conter apenas letras e espaços'),
];

const atualizarMotoristaValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(VALIDATION.ID_REGEX)
    .withMessage('ID deve conter apenas números'),

  body('nome')
    .optional()
    .isString()
    .withMessage('Nome deve ser uma string')
    .trim()
    .isLength({ min: LIMITS.NOME_MIN, max: LIMITS.NOME_MAX })
    .withMessage(
      `Nome deve ter entre ${LIMITS.NOME_MIN} e ${LIMITS.NOME_MAX} caracteres`
    )
    .matches(VALIDATION.NOME_REGEX)
    .withMessage('Nome deve conter apenas letras e espaços'),
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

const listarMotoristasValidation = [
  query('nome')
    .optional()
    .isString()
    .withMessage('Nome deve ser uma string')
    .trim(),
];

module.exports = {
  criarMotoristaValidation,
  atualizarMotoristaValidation,
  idValidation,
  listarMotoristasValidation,
};
