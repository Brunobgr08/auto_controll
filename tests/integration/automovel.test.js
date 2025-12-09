const request = require('supertest');
const app = require('../../src/server');
const AutomovelRepository = require('../../src/repositories/AutomovelRepository');

describe('API de Automóveis', () => {
  beforeEach(() => {
    AutomovelRepository.limpar();
  });

  describe('POST /api/automoveis', () => {
    it('deve criar um novo automóvel', async () => {
      const automovelData = {
        placa: 'AZC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      };

      const response = await request(app)
        .post('/api/automoveis')
        .send(automovelData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.placa).toBe('AZC1D23');
      expect(response.body.cor).toBe('Preto');
      expect(response.body.marca).toBe('Toyota');
      expect(response.body.criadoEm).toBeDefined();
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/automoveis')
        .send({ placa: '', cor: 'Preto', marca: 'Toyota' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Erro de validação');
    });

    it('deve retornar erro 409 para placa duplicada', async () => {
      // Criar primeiro automóvel
      await request(app).post('/api/automoveis').send({
        placa: 'AZC1T23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      // Tentar criar automóvel com mesma placa
      const response = await request(app).post('/api/automoveis').send({
        placa: 'AZC1T23',
        cor: 'Branco',
        marca: 'Honda',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Já existe um automóvel com esta placa'
      );
    });
  });

  describe('GET /api/automoveis', () => {
    beforeEach(async () => {
      // Criar alguns automóveis para teste
      await AutomovelRepository.criar({
        placa: 'ABC1A23',
        cor: 'Preto',
        marca: 'Toyota',
      });
      await AutomovelRepository.criar({
        placa: 'DEF4G56',
        cor: 'Branco',
        marca: 'Honda',
      });
      await AutomovelRepository.criar({
        placa: 'GHI9A012',
        cor: 'Preto',
        marca: 'Ford',
      });
    });

    it('deve listar todos os automóveis', async () => {
      const response = await request(app).get('/api/automoveis');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
    });

    it('deve filtrar automóveis por cor', async () => {
      const response = await request(app).get('/api/automoveis?cor=preto');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body.every((auto) => auto.cor === 'Preto')).toBe(true);
    });

    it('deve filtrar automóveis por marca', async () => {
      const response = await request(app).get('/api/automoveis?marca=toyota');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].marca).toBe('Toyota');
    });

    it('deve filtrar automóveis por cor e marca', async () => {
      const response = await request(app).get(
        '/api/automoveis?cor=preto&marca=ford'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].placa).toBe('GHI9A012');
    });

    it('deve retornar array vazio para filtro sem resultados', async () => {
      const response = await request(app).get('/api/automoveis?cor=azul');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/automoveis/:id', () => {
    it('deve retornar automóvel por ID', async () => {
      // Criar automóvel primeiro
      const automovelCriado = await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      const response = await request(app).get(
        `/api/automoveis/${automovelCriado.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(automovelCriado.id);
      expect(response.body.placa).toBe('ABC1D23');
    });

    it('deve retornar erro 404 para automóvel não encontrado', async () => {
      const response = await request(app).get('/api/automoveis/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel não encontrado'
      );
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app).get('/api/automoveis/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Erro de validação');
    });
  });

  describe('PUT /api/automoveis/:id', () => {
    it('deve atualizar automóvel existente', async () => {
      // Criar automóvel primeiro
      const automovelCriado = await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      const response = await request(app)
        .put(`/api/automoveis/${automovelCriado.id}`)
        .send({ cor: 'Branco', marca: 'Honda' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.cor).toBe('Branco');
      expect(response.body.marca).toBe('Honda');
      expect(response.body.id).toBe(automovelCriado.id);
    });

    it('deve retornar erro 404 para automóvel não encontrado', async () => {
      const response = await request(app)
        .put('/api/automoveis/999')
        .send({ cor: 'Branco' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel não encontrado'
      );
    });

    it('deve retornar erro 409 para placa duplicada', async () => {
      // Criar dois automóveis
      const automovel1 = await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });
      await AutomovelRepository.criar({
        placa: 'DEF5A67',
        cor: 'Branco',
        marca: 'Honda',
      });

      // Tentar atualizar o primeiro com placa do segundo
      const response = await request(app)
        .put(`/api/automoveis/${automovel1.id}`)
        .send({ placa: 'DEF5A67' });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Já existe outro automóvel com esta placa'
      );
    });
  });

  describe('DELETE /api/automoveis/:id', () => {
    it('deve excluir automóvel existente', async () => {
      // Criar automóvel primeiro
      const automovelCriado = await AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      const response = await request(app).delete(
        `/api/automoveis/${automovelCriado.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel excluído com sucesso'
      );

      // Verificar que foi excluído
      const getResponse = await request(app).get(
        `/api/automoveis/${automovelCriado.id}`
      );

      expect(getResponse.status).toBe(404);
    });

    it('deve retornar erro 404 para automóvel não encontrado', async () => {
      const response = await request(app).delete('/api/automoveis/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Automóvel não encontrado'
      );
    });
  });
});
