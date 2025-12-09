const request = require('supertest');
const app = require('../src/server');

describe('Health Check Endpoint', () => {
  it('deve retornar status 200 e informações da API', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('timestamp');
  });
});
