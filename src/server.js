const configureServer = require('./config/server');
const logger = require('./utils/logger');
require('dotenv').config();

const app = configureServer();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`
    ═══════════════════════════════════════════════════════════
     Servidor de Controle de Automóveis iniciado com sucesso!
    ═══════════════════════════════════════════════════════════

    URL: http://${HOST}:${PORT}
    Documentação: http://${HOST}:${PORT}/api-docs
    Ambiente: ${process.env.NODE_ENV || 'development'}

    Rotas disponíveis:
    ─────────────────────────────────────────────────────────────
    Health:
      • GET    /api/health                              - Verificar saúde da API

    Automóveis:
      • GET    /api/automoveis                          - Listar automóveis
      • GET    /api/automoveis?cor=Preto&marca=Toyota   - Filtrar automóveis
      • POST   /api/automoveis                          - Criar automóvel
      • GET    /api/automoveis/:id                      - Buscar automóvel por ID
      • PUT    /api/automoveis/:id                      - Atualizar automóvel
      • DELETE /api/automoveis/:id                      - Excluir automóvel

    Motoristas:
      • GET    /api/motoristas                          - Listar motoristas
      • GET    /api/motoristas?nome=João                - Filtrar motoristas
      • POST   /api/motoristas                          - Criar motorista
      • GET    /api/motoristas/:id                      - Buscar motorista por ID
      • PUT    /api/motoristas/:id                      - Atualizar motorista
      • DELETE /api/motoristas/:id                      - Excluir motorista

    Utilizações:
      • GET    /api/utilizacoes                         - Listar utilizações
      • GET    /api/utilizacoes?ativa=true              - Filtrar utilizações ativas
      • GET    /api/utilizacoes?ativa=false             - Filtrar utilizações finalizadas
      • POST   /api/utilizacoes                         - Criar utilização
      • GET    /api/utilizacoes/:id                     - Buscar utilização por ID
      • DELETE /api/utilizacoes/:id                     - Excluir utilização
      • POST   /api/utilizacoes/:id/finalizar           - Finalizar utilização
      • GET    /api/utilizacoes/automovel/:id/em-uso    - Verificar automóvel em uso
      • GET    /api/utilizacoes/motorista/:id/em-uso    - Verificar motorista em uso
    ─────────────────────────────────────────────────────────────
    Início: ${new Date().toISOString()}
    `);
  });
}

module.exports = app;
