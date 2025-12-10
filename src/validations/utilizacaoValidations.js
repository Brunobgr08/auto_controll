const { body, param, query } = require('express-validator');
const { VALIDATION, LIMITS } = require('../constants/app');

const criarUtilizacaoValidation = [
  body('automovelId')
    .notEmpty()
    .withMessage('ID do automóvel é obrigatório')
    .isString()
    .withMessage('ID do automóvel deve ser uma string')
    .matches(VALIDATION.ID_REGEX)
    .withMessage('ID do automóvel deve conter apenas números'),

  body('motoristaId')
    .notEmpty()
    .withMessage('ID do motorista é obrigatório')
    .isString()
    .withMessage('ID do motorista deve ser uma string')
    .matches(VALIDATION.ID_REGEX)
    .withMessage('ID do motorista deve conter apenas números'),

  body('motivo')
    .notEmpty()
    .withMessage('Motivo é obrigatório')
    .isString()
    .withMessage('Motivo deve ser uma string')
    .trim()
    .isLength({ min: LIMITS.MOTIVO_MIN, max: LIMITS.MOTIVO_MAX })
    .withMessage(
      `Motivo deve ter entre ${LIMITS.MOTIVO_MIN} e ${LIMITS.MOTIVO_MAX} caracteres`
    ),

  body('dataInicio')
    .optional()
    .isISO8601()
    .withMessage('Data de início deve estar no formato ISO 8601'),
];

const finalizarUtilizacaoValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(VALIDATION.ID_REGEX)
    .withMessage('ID deve conter apenas números'),

  body('dataTermino')
    .optional()
    .isISO8601()
    .withMessage('Data de término deve estar no formato ISO 8601'),
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

const listarUtilizacoesValidation = [
  query('ativa')
    .optional()
    .isBoolean()
    .withMessage('Ativa deve ser um booleano (true/false)')
    .toBoolean(),
];

module.exports = {
  criarUtilizacaoValidation,
  finalizarUtilizacaoValidation,
  idValidation,
  listarUtilizacoesValidation,
};
