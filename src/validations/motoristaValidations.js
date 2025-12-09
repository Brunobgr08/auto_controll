const { body, param, query } = require('express-validator');

// Validações para criação
const criarMotoristaValidation = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isString()
    .withMessage('Nome deve ser uma string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s']+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
];

// Validações para atualização
const atualizarMotoristaValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID é obrigatório')
    .isString()
    .withMessage('ID deve ser uma string')
    .matches(/^\d+$/)
    .withMessage('ID deve conter apenas números'),

  body('nome')
    .optional()
    .isString()
    .withMessage('Nome deve ser uma string')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s']+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
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
