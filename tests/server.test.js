const request = require('supertest');
const app = require('../src/server');

describe('Configuração do Servidor', () => {
  describe('Tratamento de erros', () => {
    it('deve retornar 404 para rotas inexistentes na API', async () => {
      const response = await request(app).get('/api/rota-inexistente');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Rota não encontrada');
      expect(response.body).toHaveProperty('path', '/api/rota-inexistente');
      expect(response.body).toHaveProperty('method', 'GET');
    });

    it('deve retornar 404 para rotas fora da API', async () => {
      const response = await request(app).get('/rota-fora-da-api');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Rota não encontrada');
      expect(response.body).toHaveProperty('path', '/rota-fora-da-api');
      expect(response.body).toHaveProperty('method', 'GET');
    });
  });

  describe('Middlewares', () => {
    it('deve aceitar JSON no body', async () => {
      const response = await request(app)
        .post('/api/test-json')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json');

      // A rota não existe, mas se o JSON for aceito, retorna 404
      // Se o JSON não for aceito, retornaria erro de parsing
      expect(response.status).toBe(404);
    });

    it('deve ter headers de segurança configurados', async () => {
      const response = await request(app).get('/api/health');

      // Verificar headers de segurança
      expect(response.headers).toHaveProperty('x-dns-prefetch-control');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-download-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });
});
