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

/**
 * @swagger
 * /utilizacoes:
 *   post:
 *     summary: Criar uma nova utilização
 *     tags: [Utilizações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - automovelId
 *               - motoristaId
 *               - motivo
 *             properties:
 *               automovelId:
 *                 type: integer
 *                 example: 1
 *               motoristaId:
 *                 type: integer
 *                 example: 1
 *               motivo:
 *                 type: string
 *                 example: "Viagem de trabalho"
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *                 description: "Data de início (opcional, padrão: agora)"
 *     responses:
 *       201:
 *         description: Utilização criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UtilizacaoCompleta'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflito - automóvel ou motorista já em uso
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
  criarUtilizacaoValidation,
  validationHandler,
  utilizacaoController.criar
);

/**
 * @swagger
 * /utilizacoes:
 *   get:
 *     summary: Listar utilizações
 *     tags: [Utilizações]
 *     parameters:
 *       - $ref: '#/components/parameters/AutomovelIdQuery'
 *       - $ref: '#/components/parameters/MotoristaIdQuery'
 *       - $ref: '#/components/parameters/Ativa'
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
 *         description: Lista de utilizações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UtilizacaoCompleta'
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
  listarUtilizacoesValidation,
  validationHandler,
  utilizacaoController.listar
);

/**
 * @swagger
 * /utilizacoes/{id}:
 *   get:
 *     summary: Buscar utilização por ID
 *     tags: [Utilizações]
 *     parameters:
 *       - $ref: '#/components/parameters/UtilizacaoId'
 *     responses:
 *       200:
 *         description: Utilização encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UtilizacaoCompleta'
 *       404:
 *         description: Utilização não encontrada
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
  utilizacaoController.buscarPorId
);

/**
 * @swagger
 * /utilizacoes/{id}/finalizar:
 *   post:
 *     summary: Finalizar utilização
 *     tags: [Utilizações]
 *     parameters:
 *       - $ref: '#/components/parameters/UtilizacaoId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dataTermino:
 *                 type: string
 *                 format: date-time
 *                 description: "Data de término (opcional, padrão: agora)"
 *     responses:
 *       200:
 *         description: Utilização finalizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UtilizacaoCompleta'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilização não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Utilização já finalizada
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
  '/:id/finalizar',
  finalizarUtilizacaoValidation,
  validationHandler,
  utilizacaoController.finalizar
);

/**
 * @swagger
 * /utilizacoes/{id}:
 *   delete:
 *     summary: Excluir utilização por ID
 *     tags: [Utilizações]
 *     parameters:
 *       - $ref: '#/components/parameters/UtilizacaoId'
 *     responses:
 *       204:
 *         description: Utilização excluída com sucesso
 *       404:
 *         description: Utilização não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Não é possível excluir utilização ativa
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
  utilizacaoController.excluir
);

/**
 * @swagger
 * /utilizacoes/automovel/{automovelId}/em-uso:
 *   get:
 *     summary: Verificar se automóvel está em uso
 *     tags: [Utilizações]
 *     parameters:
 *       - name: automovelId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do automóvel
 *     responses:
 *       200:
 *         description: Status de uso do automóvel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emUso:
 *                   type: boolean
 *                   description: "true se o automóvel está em uso"
 *                 utilizacaoId:
 *                   type: integer
 *                   nullable: true
 *                   description: "ID da utilização ativa, se existir"
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
  '/automovel/:automovelId/em-uso',
  validateAutomovelExists,
  utilizacaoController.verificarAutomovelEmUso
);

/**
 * @swagger
 * /utilizacoes/motorista/{motoristaId}/em-uso:
 *   get:
 *     summary: Verificar se motorista está em uso
 *     tags: [Utilizações]
 *     parameters:
 *       - name: motoristaId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do motorista
 *     responses:
 *       200:
 *         description: Status de uso do motorista
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emUso:
 *                   type: boolean
 *                   description: "true se o motorista está em uso"
 *                 utilizacaoId:
 *                   type: integer
 *                   nullable: true
 *                   description: "ID da utilização ativa, se existir"
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
  '/motorista/:motoristaId/em-uso',
  validateMotoristaExists,
  utilizacaoController.verificarMotoristaEmUso
);

module.exports = router;
