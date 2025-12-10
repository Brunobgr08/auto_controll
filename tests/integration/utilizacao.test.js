const request = require('supertest');
const app = require('../../src/server');
const AutomovelRepository = require('../../src/repositories/AutomovelRepository');
const MotoristaRepository = require('../../src/repositories/MotoristaRepository');
const UtilizacaoRepository = require('../../src/repositories/UtilizacaoRepository');

// Mock do logger
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

describe('API de Utilizações', () => {
  beforeEach(() => {
    // Limpar todos os repositórios
    AutomovelRepository.limpar();
    MotoristaRepository.limpar();
    UtilizacaoRepository.limpar();

    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('Regras de negócio', () => {
    beforeEach(async () => {
      // Criar dados de teste
      await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      await AutomovelRepository.criar({
        placa: 'XYZ9A87',
        cor: 'Branco',
        marca: 'Honda',
      });

      await MotoristaRepository.criar({ nome: 'João Silva' });
      await MotoristaRepository.criar({ nome: 'Maria Santos' });
    });

    it('não deve permitir criar utilização se automóvel já estiver em uso', async () => {
      // Criar primeira utilização
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Tentar criar segunda utilização com mesmo automóvel
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '2',
        motivo: 'Outra viagem',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel já está em uso'
      );
    });

    it('não deve permitir criar utilização se motorista já estiver em uso', async () => {
      // Criar primeira utilização
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Tentar criar segunda utilização com mesmo motorista
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '2',
        motoristaId: '1',
        motivo: 'Outra viagem',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista já está utilizando outro automóvel'
      );
    });

    it('deve permitir criar utilização após finalizar a anterior', async () => {
      // Criar e finalizar primeira utilização
      const utilizacao1 = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 1',
      });

      await request(app)
        .post(`/api/utilizacoes/${utilizacao1.body.id}/finalizar`)
        .send({
          dataTermino: '2023-12-08T18:00:00.000Z',
        });

      // Deve permitir criar nova utilização com mesmo automóvel
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '2',
        motivo: 'Viagem 2',
      });

      expect(response.status).toBe(201);
    });

    it('não deve permitir finalizar utilização já finalizada', async () => {
      // Criar utilização
      const utilizacao = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Finalizar pela primeira vez
      await request(app).post(
        `/api/utilizacoes/${utilizacao.body.id}/finalizar`
      );

      // Tentar finalizar novamente
      const response = await request(app).post(
        `/api/utilizacoes/${utilizacao.body.id}/finalizar`
      );

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Utilização já foi finalizada'
      );
    });
  });

  describe('Endpoints básicos', () => {
    beforeEach(async () => {
      // Criar dados básicos
      await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      await MotoristaRepository.criar({ nome: 'João Silva' });
    });

    it('deve criar uma nova utilização', async () => {
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.automovelId).toBe('1');
      expect(response.body.motoristaId).toBe('1');
      expect(response.body.motivo).toBe('Viagem a negócios');
      expect(response.body.dataTermino).toBeNull();
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '',
        motoristaId: '1',
        motivo: 'Teste',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Erro de validação');
    });

    it('deve retornar erro 404 para automóvel não encontrado', async () => {
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '999',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel não encontrado'
      );
    });

    it('deve retornar erro 404 para motorista não encontrado', async () => {
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '999',
        motivo: 'Viagem a negócios',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista não encontrado'
      );
    });

    it('deve listar utilizações', async () => {
      // Criar utilização primeiro
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      const response = await request(app).get('/api/utilizacoes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('automovel');
      expect(response.body[0]).toHaveProperty('motorista');
    });

    it('deve filtrar utilizações por status ativo', async () => {
      // Criar um segundo automóvel
      await AutomovelRepository.criar({
        placa: 'XYZ9A55',
        cor: 'Branco',
        marca: 'Nissan',
      });

      // Criar um segundo motorista
      await MotoristaRepository.criar({ nome: 'Miguel Santos' });
      // Criar duas utilizações
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 10',
      });

      const utilizacao2 = await request(app).post('/api/utilizacoes').send({
        automovelId: '2',
        motoristaId: '2',
        motivo: 'Viagem 20',
      });

      // Finalizar segunda utilização
      await request(app).post(
        `/api/utilizacoes/${utilizacao2.body.id}/finalizar`
      );

      // Listar apenas ativas
      const response = await request(app).get('/api/utilizacoes?ativa=true');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].ativa).toBe(true);
    });
  });
});
