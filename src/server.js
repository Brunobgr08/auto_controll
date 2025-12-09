const configureServer = require('./config/server');
const logger = require('./utils/logger');
require('dotenv').config();

const app = configureServer();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`
    - Servidor iniciado com sucesso!

    - URL: http://${HOST}:${PORT}
    - Health Check: http://${HOST}:${PORT}/api/health
    - Ambiente: ${process.env.NODE_ENV || 'development'}

    - Rotas disponíveis:
      • GET  /api/health      - Verificar saúde da API

    - Início: ${new Date().toISOString()}
    `);
  });
}

module.exports = app;
