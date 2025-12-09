const express = require('express');
const router = express.Router();
const utilizacaoController = require('../controllers/UtilizacaoController');
const validationHandler = require('../middlewares/validationHandler');
const {
  validateAutomovelExists,
  validateMotoristaExists,
} = require('../middlewares/existsValidation');
const {
  criarUtilizacaoValidation,
  finalizarUtilizacaoValidation,
  idValidation,
  listarUtilizacoesValidation,
} = require('../validations/utilizacaoValidations');

// Rotas CRUD para utilizações
router.post(
  '/',
  criarUtilizacaoValidation,
  validationHandler,
  utilizacaoController.criar
);

router.get(
  '/',
  listarUtilizacoesValidation,
  validationHandler,
  utilizacaoController.listar
);

router.get(
  '/:id',
  idValidation,
  validationHandler,
  utilizacaoController.buscarPorId
);

router.post(
  '/:id/finalizar',
  finalizarUtilizacaoValidation,
  validationHandler,
  utilizacaoController.finalizar
);

router.delete(
  '/:id',
  idValidation,
  validationHandler,
  utilizacaoController.excluir
);

// Rotas de verificação
router.get(
  '/automovel/:automovelId/em-uso',
  validateAutomovelExists,
  utilizacaoController.verificarAutomovelEmUso
);

router.get(
  '/motorista/:motoristaId/em-uso',
  validateMotoristaExists,
  utilizacaoController.verificarMotoristaEmUso
);

module.exports = router;
