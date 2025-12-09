const express = require('express');
const router = express.Router();
const automovelController = require('../controllers/AutomovelController');
const validationHandler = require('../middlewares/validationHandler');
const {
  criarAutomovelValidation,
  atualizarAutomovelValidation,
  idValidation,
  listarAutomoveisValidation,
} = require('../validations/automovelValidations');

// Rotas CRUD para automóveis
router.post(
  '/',
  criarAutomovelValidation,
  validationHandler,
  automovelController.criar
);

router.get(
  '/',
  listarAutomoveisValidation,
  validationHandler,
  automovelController.listar
);

router.get(
  '/:id',
  idValidation,
  validationHandler,
  automovelController.buscarPorId
);

router.put(
  '/:id',
  atualizarAutomovelValidation,
  validationHandler,
  automovelController.atualizar
);

router.delete(
  '/:id',
  idValidation,
  validationHandler,
  automovelController.excluir
);

module.exports = router;
