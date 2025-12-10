const request = require('supertest');
const app = require('../../src/server');
const AutomovelRepository = require('../../src/repositories/AutomovelRepository');
const MotoristaRepository = require('../../src/repositories/MotoristaRepository');

// Mock do logger
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('Middlewares de Validação', () => {
  beforeEach(() => {
    // Limpar repositórios
    AutomovelRepository.limpar();
    MotoristaRepository.limpar();

    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('Validação de Existência de Automóvel', () => {
    it('deve permitir acesso quando automóvel existe', async () => {
      // Criar automóvel
      await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      await MotoristaRepository.criar({ nome: 'João Silva' });

      // Criar utilização para testar
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Verificar se automóvel está em uso (rota que usa o middleware)
      const response = await request(app).get(
        '/api/utilizacoes/automovel/1/em-uso'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('emUso', true);
    });

    it('deve retornar 404 quando automóvel não existe', async () => {
      const response = await request(app).get(
        '/api/utilizacoes/automovel/999/em-uso'
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel não encontrado'
      );
    });
  });

  describe('Validação de Existência de Motorista', () => {
    it('deve permitir acesso quando motorista existe', async () => {
      // Criar motorista
      await MotoristaRepository.criar({ nome: 'João Silva' });

      await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      // Criar utilização para testar
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Verificar se motorista está em uso (rota que usa o middleware)
      const response = await request(app).get(
        '/api/utilizacoes/motorista/1/em-uso'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('emUso', true);
    });

    it('deve retornar 404 quando motorista não existe', async () => {
      const response = await request(app).get(
        '/api/utilizacoes/motorista/999/em-uso'
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista não encontrado'
      );
    });
  });
});
