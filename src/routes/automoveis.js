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

/**
 * @swagger
 * /automoveis:
 *   post:
 *     summary: Criar um novo automóvel
 *     tags: [Automóveis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - placa
 *               - cor
 *               - marca
 *             properties:
 *               placa:
 *                 type: string
 *                 example: "ABC1D23"
 *               cor:
 *                 type: string
 *                 example: "Preto"
 *               marca:
 *                 type: string
 *                 example: "Toyota"
 *     responses:
 *       201:
 *         description: Automóvel criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Automovel'
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
  criarAutomovelValidation,
  validationHandler,
  automovelController.criar
);

/**
 * @swagger
 * /automoveis:
 *   get:
 *     summary: Listar todos os automóveis
 *     tags: [Automóveis]
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
 *         description: Lista de automóveis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Automovel'
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
  listarAutomoveisValidation,
  validationHandler,
  automovelController.listar
);

/**
 * @swagger
 * /automoveis/{id}:
 *   get:
 *     summary: Buscar automóvel por ID
 *     tags: [Automóveis]
 *     parameters:
 *       - $ref: '#/components/parameters/AutomovelId'
 *     responses:
 *       200:
 *         description: Automóvel encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Automovel'
 *       404:
 *         description: Automóvel não encontrado
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
  automovelController.buscarPorId
);

/**
 * @swagger
 * /automoveis/{id}:
 *   put:
 *     summary: Atualizar automóvel por ID
 *     tags: [Automóveis]
 *     parameters:
 *       - $ref: '#/components/parameters/AutomovelId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *                 example: "XYZ9A87"
 *               cor:
 *                 type: string
 *                 example: "Branco"
 *               marca:
 *                 type: string
 *                 example: "Honda"
 *     responses:
 *       200:
 *         description: Automóvel atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Automovel'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Automóvel não encontrado
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
  atualizarAutomovelValidation,
  validationHandler,
  automovelController.atualizar
);

/**
 * @swagger
 * /automoveis/{id}:
 *   delete:
 *     summary: Excluir automóvel por ID
 *     tags: [Automóveis]
 *     parameters:
 *       - $ref: '#/components/parameters/AutomovelId'
 *     responses:
 *       204:
 *         description: Automóvel excluído com sucesso
 *       404:
 *         description: Automóvel não encontrado
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
  automovelController.excluir
);

module.exports = router;
