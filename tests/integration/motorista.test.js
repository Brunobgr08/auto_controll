const request = require('supertest');
const app = require('../../src/server');
const MotoristaRepository = require('../../src/repositories/MotoristaRepository');

describe('API de Motoristas', () => {
  beforeEach(() => {
    MotoristaRepository.limpar();
  });

  describe('POST /api/motoristas', () => {
    it('deve criar um novo motorista', async () => {
      const motoristaData = {
        nome: 'João Silva',
      };

      const response = await request(app)
        .post('/api/motoristas')
        .send(motoristaData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome).toBe('João Silva');
      expect(response.body.criadoEm).toBeDefined();
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const response = await request(app)
        .post('/api/motoristas')
        .send({ nome: '' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Erro de validação');
    });

    it('deve retornar erro 409 para nome duplicado', async () => {
      // Criar primeiro motorista
      await request(app).post('/api/motoristas').send({ nome: 'João Silva' });

      // Tentar criar motorista com mesmo nome
      const response = await request(app)
        .post('/api/motoristas')
        .send({ nome: 'João Silva' });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Já existe um motorista com este nome'
      );
    });
  });

  describe('GET /api/motoristas', () => {
    beforeEach(async () => {
      // Criar alguns motoristas para teste
      await MotoristaRepository.criar({ nome: 'João Silva' });
      await MotoristaRepository.criar({ nome: 'Maria Santos' });
      await MotoristaRepository.criar({ nome: 'Carlos Oliveira' });
    });

    it('deve listar todos os motoristas', async () => {
      const response = await request(app).get('/api/motoristas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(3);
    });

    it('deve filtrar motoristas por nome', async () => {
      const response = await request(app).get('/api/motoristas?nome=silva');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].nome).toBe('João Silva');
    });

    it('deve retornar array vazio para filtro sem resultados', async () => {
      const response = await request(app).get(
        '/api/motoristas?nome=inexistente'
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/motoristas/:id', () => {
    it('deve retornar motorista por ID', async () => {
      // Criar motorista primeiro
      const motoristaCriado = await MotoristaRepository.criar({
        nome: 'João Silva',
      });

      const response = await request(app).get(
        `/api/motoristas/${motoristaCriado.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(motoristaCriado.id);
      expect(response.body.nome).toBe('João Silva');
    });

    it('deve retornar erro 404 para motorista não encontrado', async () => {
      const response = await request(app).get('/api/motoristas/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista não encontrado'
      );
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app).get('/api/motoristas/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Erro de validação');
    });
  });

  describe('PUT /api/motoristas/:id', () => {
    it('deve atualizar motorista existente', async () => {
      // Criar motorista primeiro
      const motoristaCriado = await MotoristaRepository.criar({
        nome: 'João Silva',
      });

      const response = await request(app)
        .put(`/api/motoristas/${motoristaCriado.id}`)
        .send({ nome: 'João da Silva' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('João da Silva');
      expect(response.body.id).toBe(motoristaCriado.id);
    });

    it('deve retornar erro 404 para motorista não encontrado', async () => {
      const response = await request(app)
        .put('/api/motoristas/999')
        .send({ nome: 'Novo Nome' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista não encontrado'
      );
    });

    it('deve retornar erro 409 para nome duplicado', async () => {
      // Criar dois motoristas
      const motorista1 = await MotoristaRepository.criar({
        nome: 'João Silva',
      });
      await MotoristaRepository.criar({ nome: 'Maria Santos' });

      // Tentar atualizar o segundo com nome do primeiro
      const response = await request(app)
        .put(`/api/motoristas/${motorista1.id}`)
        .send({ nome: 'Maria Santos' });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'message',
        'Já existe um motorista com este nome'
      );
    });
  });

  describe('DELETE /api/motoristas/:id', () => {
    it('deve excluir motorista existente', async () => {
      // Criar motorista primeiro
      const motoristaCriado = await MotoristaRepository.criar({
        nome: 'João Silva',
      });

      const response = await request(app).delete(
        `/api/motoristas/${motoristaCriado.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista excluído com sucesso'
      );

      // Verificar que foi excluído
      const getResponse = await request(app).get(
        `/api/motoristas/${motoristaCriado.id}`
      );

      expect(getResponse.status).toBe(404);
    });

    it('deve retornar erro 404 para motorista não encontrado', async () => {
      const response = await request(app).delete('/api/motoristas/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'Motorista não encontrado'
      );
    });
  });
});
