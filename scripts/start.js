const app = require('../src/server');
const logger = require('../src/utils/logger');

const PORT = process.env.PORT || 3000;

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Exceção não capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Rejeição não tratada:', { reason, promise });
  process.exit(1);
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor iniciado na porta ${PORT}`);
});
