const express = require('express');
const router = express.Router();

// Health check route
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
// router.use('/utilizacoes', require('./utilizacoes'));

module.exports = router;
