const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar saúde da API
 *     tags: [Saúde]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Health'
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API está funcionando corretamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Rotas específicas para cada recurso
router.use('/automoveis', require('./automoveis'));
router.use('/motoristas', require('./motoristas'));
router.use('/utilizacoes', require('./utilizacoes'));

module.exports = router;
