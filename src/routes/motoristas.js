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

/**
 * @swagger
 * /motoristas:
 *   post:
 *     summary: Criar um novo motorista
 *     tags: [Motoristas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *     responses:
 *       201:
 *         description: Motorista criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motorista'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  criarMotoristaValidation,
  validationHandler,
  motoristaController.criar
);

/**
 * @swagger
 * /motoristas:
 *   get:
 *     summary: Listar todos os motoristas
 *     tags: [Motoristas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista de motoristas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Motorista'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  listarMotoristasValidation,
  validationHandler,
  motoristaController.listar
);

/**
 * @swagger
 * /motoristas/{id}:
 *   get:
 *     summary: Buscar motorista por ID
 *     tags: [Motoristas]
 *     parameters:
 *       - $ref: '#/components/parameters/MotoristaId'
 *     responses:
 *       200:
 *         description: Motorista encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motorista'
 *       404:
 *         description: Motorista não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  idValidation,
  validationHandler,
  motoristaController.buscarPorId
);

/**
 * @swagger
 * /motoristas/{id}:
 *   put:
 *     summary: Atualizar motorista por ID
 *     tags: [Motoristas]
 *     parameters:
 *       - $ref: '#/components/parameters/MotoristaId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria Santos"
 *     responses:
 *       200:
 *         description: Motorista atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motorista'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Motorista não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  atualizarMotoristaValidation,
  validationHandler,
  motoristaController.atualizar
);

/**
 * @swagger
 * /motoristas/{id}:
 *   delete:
 *     summary: Excluir motorista por ID
 *     tags: [Motoristas]
 *     parameters:
 *       - $ref: '#/components/parameters/MotoristaId'
 *     responses:
 *       204:
 *         description: Motorista excluído com sucesso
 *       404:
 *         description: Motorista não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  idValidation,
  validationHandler,
  motoristaController.excluir
);

module.exports = router;
