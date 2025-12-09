const express = require('express');
const router = express.Router();
const motoristaController = require('../controllers/MotoristaController');
const validationHandler = require('../middlewares/validationHandler');
const {
  criarMotoristaValidation,
  atualizarMotoristaValidation,
  idValidation,
  listarMotoristasValidation,
} = require('../validations/motoristaValidations');

// Rotas CRUD para motoristas
router.post(
  '/',
  criarMotoristaValidation,
  validationHandler,
  motoristaController.criar
);

router.get(
  '/',
  listarMotoristasValidation,
  validationHandler,
  motoristaController.listar
);

router.get(
  '/:id',
  idValidation,
  validationHandler,
  motoristaController.buscarPorId
);

router.put(
  '/:id',
  atualizarMotoristaValidation,
  validationHandler,
  motoristaController.atualizar
);

router.delete(
  '/:id',
  idValidation,
  validationHandler,
  motoristaController.excluir
);

module.exports = router;
