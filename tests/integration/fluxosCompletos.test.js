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

describe('Fluxos Completos do Sistema', () => {
  beforeEach(() => {
    // Limpar todos os repositórios
    AutomovelRepository.limpar();
    MotoristaRepository.limpar();
    UtilizacaoRepository.limpar();

    // Limpar mocks
    jest.clearAllMocks();
  });

  describe('Fluxo Completo: Cadastro → Utilização → Finalização', () => {
    it('deve executar fluxo completo sem erros', async () => {
      // 1. Cadastrar automóvel
      const automovelResponse = await request(app)
        .post('/api/automoveis')
        .send({
          placa: 'ABC1D23',
          cor: 'Preto',
          marca: 'Toyota',
        });

      expect(automovelResponse.status).toBe(201);
      const automovelId = automovelResponse.body.id;

      // 2. Cadastrar motorista
      const motoristaResponse = await request(app)
        .post('/api/motoristas')
        .send({
          nome: 'João Silva',
        });

      expect(motoristaResponse.status).toBe(201);
      const motoristaId = motoristaResponse.body.id;

      // 3. Verificar que automóvel não está em uso
      const verificarAntes = await request(app).get(
        `/api/utilizacoes/automovel/${automovelId}/em-uso`
      );

      expect(verificarAntes.status).toBe(200);
      expect(verificarAntes.body.emUso).toBe(false);

      // 4. Criar utilização
      const utilizacaoResponse = await request(app)
        .post('/api/utilizacoes')
        .send({
          automovelId,
          motoristaId,
          motivo: 'Viagem a São Paulo para reunião',
        });

      expect(utilizacaoResponse.status).toBe(201);
      const utilizacaoId = utilizacaoResponse.body.id;

      // 5. Verificar que automóvel agora está em uso
      const verificarDurante = await request(app).get(
        `/api/utilizacoes/automovel/${automovelId}/em-uso`
      );

      expect(verificarDurante.status).toBe(200);
      expect(verificarDurante.body.emUso).toBe(true);

      // 6. Listar utilizações ativas
      const listarAtivas = await request(app).get(
        '/api/utilizacoes?ativa=true'
      );

      expect(listarAtivas.status).toBe(200);
      expect(listarAtivas.body).toHaveLength(1);
      expect(listarAtivas.body[0].id).toBe(utilizacaoId);

      // 7. Finalizar utilização
      const finalizarResponse = await request(app)
        .post(`/api/utilizacoes/${utilizacaoId}/finalizar`)
        .send({
          dataTermino: '2023-12-08T18:00:00.000Z',
        });

      expect(finalizarResponse.status).toBe(200);
      expect(finalizarResponse.body.dataTermino).toBe(
        '2023-12-08T18:00:00.000Z'
      );

      // 8. Verificar que automóvel não está mais em uso
      const verificarDepois = await request(app).get(
        `/api/utilizacoes/automovel/${automovelId}/em-uso`
      );

      expect(verificarDepois.status).toBe(200);
      expect(verificarDepois.body.emUso).toBe(false);

      // 9. Listar utilizações finalizadas
      const listarFinalizadas = await request(app).get(
        '/api/utilizacoes?ativa=false'
      );

      expect(listarFinalizadas.status).toBe(200);
      expect(listarFinalizadas.body).toHaveLength(1);
      expect(listarFinalizadas.body[0].id).toBe(utilizacaoId);
    });
  });

  describe('Fluxo com Múltiplos Recursos', () => {
    it('deve gerenciar múltiplos automóveis e motoristas', async () => {
      // 1. Cadastrar múltiplos automóveis
      const automovel1 = await request(app)
        .post('/api/automoveis')
        .send({ placa: 'ABC1D23', cor: 'Preto', marca: 'Toyota' });

      const automovel2 = await request(app)
        .post('/api/automoveis')
        .send({ placa: 'XYZ9A87', cor: 'Branco', marca: 'Honda' });

      // 2. Cadastrar múltiplos motoristas
      const motorista1 = await request(app)
        .post('/api/motoristas')
        .send({ nome: 'João Silva' });

      const motorista2 = await request(app)
        .post('/api/motoristas')
        .send({ nome: 'Maria Santos' });

      // 3. Criar utilizações simultâneas
      await request(app).post('/api/utilizacoes').send({
        automovelId: automovel1.body.id,
        motoristaId: motorista1.body.id,
        motivo: 'Viagem 1',
      });

      await request(app).post('/api/utilizacoes').send({
        automovelId: automovel2.body.id,
        motoristaId: motorista2.body.id,
        motivo: 'Viagem 2',
      });

      // 4. Verificar que ambos estão em uso
      const verificar1 = await request(app).get(
        `/api/utilizacoes/automovel/${automovel1.body.id}/em-uso`
      );

      const verificar2 = await request(app).get(
        `/api/utilizacoes/automovel/${automovel2.body.id}/em-uso`
      );

      expect(verificar1.body.emUso).toBe(true);
      expect(verificar2.body.emUso).toBe(true);

      // 5. Tentar criar utilização conflitante (deve falhar)
      const conflitoResponse = await request(app)
        .post('/api/utilizacoes')
        .send({
          automovelId: automovel1.body.id,
          motoristaId: motorista2.body.id,
          motivo: 'Viagem conflitante',
        });

      expect(conflitoResponse.status).toBe(409);

      // 6. Listar todos os automóveis
      const automoveisResponse = await request(app).get('/api/automoveis');

      expect(automoveisResponse.status).toBe(200);
      expect(automoveisResponse.body).toHaveLength(2);

      // 7. Filtrar automóveis por cor
      const automoveisPretos = await request(app).get(
        '/api/automoveis?cor=Preto'
      );

      expect(automoveisPretos.status).toBe(200);
      expect(automoveisPretos.body).toHaveLength(1);
      expect(automoveisPretos.body[0].placa).toBe('ABC1D23');

      // 8. Filtrar motoristas por nome
      const motoristasSilva = await request(app).get(
        '/api/motoristas?nome=silva'
      );

      expect(motoristasSilva.status).toBe(200);
      expect(motoristasSilva.body).toHaveLength(1);
      expect(motoristasSilva.body[0].nome).toBe('João Silva');
    });
  });

  describe('Fluxo de Exclusão com Validações', () => {
    it('deve validar dependências ao excluir recursos', async () => {
      // 1. Criar recursos
      const automovel = await request(app)
        .post('/api/automoveis')
        .send({ placa: 'ABC1D23', cor: 'Preto', marca: 'Toyota' });

      const motorista = await request(app)
        .post('/api/motoristas')
        .send({ nome: 'João Silva' });

      // 2. Criar utilização ativa
      const utilizacao = await request(app).post('/api/utilizacoes').send({
        automovelId: automovel.body.id,
        motoristaId: motorista.body.id,
        motivo: 'Viagem',
      });

      // 3. Tentar excluir automóvel em uso (deve falhar)
      const excluirAutomovelResponse = await request(app).delete(
        `/api/automoveis/${automovel.body.id}`
      );

      expect(excluirAutomovelResponse.status).toBe(409);

      // 4. Tentar excluir motorista em uso (deve falhar)
      const excluirMotoristaResponse = await request(app).delete(
        `/api/motoristas/${motorista.body.id}`
      );

      expect(excluirMotoristaResponse.status).toBe(409);

      // 5. Finalizar utilização
      await request(app).post(
        `/api/utilizacoes/${utilizacao.body.id}/finalizar`
      );

      // 6. Tentar excluir automóvel com histórico (deve falhar)
      const excluirAutomovelHistoricoResponse = await request(app).delete(
        `/api/automoveis/${automovel.body.id}`
      );

      expect(excluirAutomovelHistoricoResponse.status).toBe(409);

      // 7. Tentar excluir utilização ativa (deve falhar - mas já está finalizada)
      // Na verdade deve permitir excluir utilização finalizada
      const excluirUtilizacaoResponse = await request(app).delete(
        `/api/utilizacoes/${utilizacao.body.id}`
      );

      expect(excluirUtilizacaoResponse.status).toBe(200);

      // 8. Agora deve permitir excluir automóvel e motorista
      // (mas ainda tem histórico, então ainda não pode)
      // Para este teste, vamos criar novos recursos sem histórico
      const automovel2 = await request(app)
        .post('/api/automoveis')
        .send({ placa: 'XYZ9A87', cor: 'Branco', marca: 'Honda' });

      const excluirAutomovel2Response = await request(app).delete(
        `/api/automoveis/${automovel2.body.id}`
      );

      expect(excluirAutomovel2Response.status).toBe(200);
    });
  });
});
