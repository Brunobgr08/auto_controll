const { body, param, query } = require('express-validator');

// Validações para criação de utilização
const criarUtilizacaoValidation = [
  body('automovelId')
    .notEmpty()
    .withMessage('ID do automóvel é obrigatório')
    .isString()
    .withMessage('ID do automóvel deve ser uma string')
    .matches(/^\d+$/)
    .withMessage('ID do automóvel deve conter apenas números'),

  body('motoristaId')
    .notEmpty()
    .withMessage('ID do motorista é obrigatório')
    .isString()
    .withMessage('ID do motorista deve ser uma string')
    .matches(/^\d+$/)
    .withMessage('ID do motorista deve conter apenas números'),

  body('motivo')
    .notEmpty()
    .withMessage('Motivo é obrigatório')
    .isString()
    .withMessage('Motivo deve ser uma string')
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Motivo deve ter entre 5 e 500 caracteres'),

  body('dataInicio')
    .optional()
    .isISO8601()
    .withMessage('Data de início deve estar no formato ISO 8601'),
];

// Validações para finalização de utilização
const finalizarUtilizacaoValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(/^\d+$/)
    .withMessage('ID deve conter apenas números'),

  body('dataTermino')
    .optional()
    .isISO8601()
    .withMessage('Data de término deve estar no formato ISO 8601'),
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
