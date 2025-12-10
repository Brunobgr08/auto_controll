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

describe('Validações de Integridade Referencial', () => {
  beforeEach(() => {
    // Limpar todos os repositórios
    AutomovelRepository.limpar();
    MotoristaRepository.limpar();
    UtilizacaoRepository.limpar();

    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('Exclusão de Automóvel', () => {
    beforeEach(async () => {
      // Criar dados de teste
      await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      await MotoristaRepository.criar({ nome: 'João Silva' });
    });

    it('não deve permitir excluir automóvel em uso', async () => {
      // Criar utilização ativa
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Tentar excluir automóvel em uso
      const response = await request(app).delete('/api/automoveis/1');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel já está em uso'
      );
    });

    it('não deve permitir excluir automóvel com histórico de utilizações', async () => {
      // Criar utilização
      const utilizacao = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Finalizar utilização
      await request(app).post(
        `/api/utilizacoes/${utilizacao.body.id}/finalizar`
      );

      // Tentar excluir automóvel com histórico
      const response = await request(app).delete('/api/automoveis/1');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Não é possível excluir automóvel com histórico de utilizações. Considere desativar em vez de excluir.'
      );
    });

    it('deve permitir excluir automóvel sem utilizações', async () => {
      // Criar um segundo automóvel sem utilizações
      await AutomovelRepository.criar({
        placa: 'XYZ9A87',
        cor: 'Branco',
        marca: 'Honda',
      });

      // Excluir automóvel sem utilizações
      const response = await request(app).delete('/api/automoveis/2');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel excluído com sucesso'
      );

      // Verificar que foi excluído
      const getResponse = await request(app).get('/api/automoveis/2');

      expect(getResponse.status).toBe(404);
    });
  });

  describe('Exclusão de Motorista', () => {
    beforeEach(async () => {
      // Criar dados de teste
      await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      await MotoristaRepository.criar({ nome: 'João Silva' });
    });

    it('não deve permitir excluir motorista em uso', async () => {
      // Criar utilização ativa
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Tentar excluir motorista em uso
      const response = await request(app).delete('/api/motoristas/1');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista já está utilizando outro automóvel'
      );
    });

    it('não deve permitir excluir motorista com histórico de utilizações', async () => {
      // Criar utilização
      const utilizacao = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Finalizar utilização
      await request(app).post(
        `/api/utilizacoes/${utilizacao.body.id}/finalizar`
      );

      // Tentar excluir motorista com histórico
      const response = await request(app).delete('/api/motoristas/1');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Não é possível excluir motorista com histórico de utilizações. Considere desativar em vez de excluir.'
      );
    });

    it('deve permitir excluir motorista sem utilizações', async () => {
      // Criar um segundo motorista sem utilizações
      await MotoristaRepository.criar({ nome: 'Maria Santos' });

      // Excluir motorista sem utilizações
      const response = await request(app).delete('/api/motoristas/2');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista excluído com sucesso'
      );

      // Verificar que foi excluído
      const getResponse = await request(app).get('/api/motoristas/2');

      expect(getResponse.status).toBe(404);
    });
  });

  describe('Exclusão de Utilização', () => {
    beforeEach(async () => {
      // Criar dados de teste
      await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      await MotoristaRepository.criar({ nome: 'João Silva' });
    });

    it('não deve permitir excluir utilização ativa', async () => {
      // Criar utilização ativa
      const utilizacao = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Tentar excluir utilização ativa
      const response = await request(app).delete(
        `/api/utilizacoes/${utilizacao.body.id}`
      );

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Não é possível excluir uma utilização ativa. Finalize-a primeiro.'
      );
    });

    it('deve permitir excluir utilização finalizada', async () => {
      // Criar utilização
      const utilizacao = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      // Finalizar utilização
      await request(app).post(
        `/api/utilizacoes/${utilizacao.body.id}/finalizar`
      );

      // Excluir utilização finalizada
      const response = await request(app).delete(
        `/api/utilizacoes/${utilizacao.body.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Utilização excluída com sucesso'
      );

      // Verificar que foi excluída
      const getResponse = await request(app).get(
        `/api/utilizacoes/${utilizacao.body.id}`
      );

      expect(getResponse.status).toBe(404);
    });
  });

  describe('Criação de Utilização com Validações', () => {
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

    it('não deve permitir criar utilização com automóvel inexistente', async () => {
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

    it('não deve permitir criar utilização com motorista inexistente', async () => {
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

    it('deve retornar erro específico para automóvel em uso', async () => {
      // Criar primeira utilização
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 1',
      });

      // Tentar criar segunda utilização com mesmo automóvel
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '2',
        motivo: 'Viagem 2',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel já está em uso'
      );
    });

    it('deve retornar erro específico para motorista em uso', async () => {
      // Criar primeira utilização
      await request(app).post('/api/utilizacoes').send({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 1',
      });

      // Tentar criar segunda utilização com mesmo motorista
      const response = await request(app).post('/api/utilizacoes').send({
        automovelId: '2',
        motoristaId: '1',
        motivo: 'Viagem 2',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista já está utilizando outro automóvel'
      );
    });
  });
});
