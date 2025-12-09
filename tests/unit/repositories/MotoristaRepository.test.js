const MotoristaRepository = require('../../../src/repositories/MotoristaRepository');

describe('Repositório de Motoristas', () => {
  beforeEach(() => {
    MotoristaRepository.limpar();
  });

  describe('criar', () => {
    it('deve criar um novo motorista', () => {
      const motoristaData = {
        nome: 'João Silva',
      };

      const motorista = MotoristaRepository.criar(motoristaData);

      expect(motorista).toHaveProperty('id');
      expect(motorista.nome).toBe('João Silva');
      expect(motorista.criadoEm).toBeDefined();
    });

    it('deve gerar IDs sequenciais', () => {
      const motorista1 = MotoristaRepository.criar({ nome: 'João Silva' });
      const motorista2 = MotoristaRepository.criar({ nome: 'Maria Santos' });

      expect(motorista1.id).toBe('1');
      expect(motorista2.id).toBe('2');
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar motorista existente', () => {
      const motoristaData = {
        nome: 'João Silva',
      };

      const motoristaCriado = MotoristaRepository.criar(motoristaData);
      const motoristaBuscado = MotoristaRepository.buscarPorId(
        motoristaCriado.id
      );

      expect(motoristaBuscado).toEqual(motoristaCriado);
    });

    it('deve retornar null para ID não existente', () => {
      const motorista = MotoristaRepository.buscarPorId('999');
      expect(motorista).toBeNull();
    });
  });

  describe('listar', () => {
    beforeEach(() => {
      MotoristaRepository.criar({ nome: 'João Silva' });
      MotoristaRepository.criar({ nome: 'Maria Santos' });
      MotoristaRepository.criar({ nome: 'Carlos Oliveira' });
    });

    it('deve retornar todos os motoristas sem filtros', () => {
      const motoristas = MotoristaRepository.listar();
      expect(motoristas).toHaveLength(3);
    });

    it('deve filtrar por nome (busca parcial case-insensitive)', () => {
      const motoristas = MotoristaRepository.listar({ nome: 'silva' });
      expect(motoristas).toHaveLength(1);
      expect(motoristas[0].nome).toBe('João Silva');
    });

    it('deve retornar múltiplos resultados para busca parcial', () => {
      MotoristaRepository.criar({ nome: 'Silvana Costa' });

      const motoristas = MotoristaRepository.listar({ nome: 'silva' });
      expect(motoristas).toHaveLength(2);
      expect(motoristas.map((m) => m.nome)).toEqual(
        expect.arrayContaining(['João Silva', 'Silvana Costa'])
      );
    });

    it('deve retornar array vazio para filtro sem resultados', () => {
      const motoristas = MotoristaRepository.listar({ nome: 'inexistente' });
      expect(motoristas).toHaveLength(0);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar motorista existente', () => {
      const motoristaCriado = MotoristaRepository.criar({
        nome: 'João Silva',
      });

      const atualizado = MotoristaRepository.atualizar(motoristaCriado.id, {
        nome: 'João da Silva',
      });

      expect(atualizado.nome).toBe('João da Silva');
      expect(atualizado.atualizadoEm).toBeDefined();

      // Verificar que é uma data ISO válida
      expect(() => new Date(atualizado.atualizadoEm)).not.toThrow();
    });

    it('deve retornar null para ID não existente', () => {
      const atualizado = MotoristaRepository.atualizar('999', {
        nome: 'Novo Nome',
      });
      expect(atualizado).toBeNull();
    });
  });

  describe('excluir', () => {
    it('deve excluir motorista existente', () => {
      const motorista = MotoristaRepository.criar({
        nome: 'João Silva',
      });

      const excluido = MotoristaRepository.excluir(motorista.id);
      expect(excluido).toBe(true);

      const buscado = MotoristaRepository.buscarPorId(motorista.id);
      expect(buscado).toBeNull();
    });

    it('deve retornar false para ID não existente', () => {
      const excluido = MotoristaRepository.excluir('999');
      expect(excluido).toBe(false);
    });
  });

  describe('motoristaExiste', () => {
    beforeEach(() => {
      MotoristaRepository.criar({ nome: 'João Silva' });
    });

    it('deve retornar true para nome existente (case-insensitive)', () => {
      const existe = MotoristaRepository.motoristaExiste('joão silva');
      expect(existe).toBe(true);
    });

    it('deve retornar false para nome inexistente', () => {
      const existe = MotoristaRepository.motoristaExiste('Maria Santos');
      expect(existe).toBe(false);
    });

    it('deve ignorar o próprio motorista quando especificado', () => {
      const motorista = MotoristaRepository.buscarPorNome('João Silva');
      const existe = MotoristaRepository.motoristaExiste(
        'João Silva',
        motorista.id
      );
      expect(existe).toBe(false);
    });
  });

  describe('buscarPorNome', () => {
    beforeEach(() => {
      MotoristaRepository.criar({ nome: 'João Silva' });
    });

    it('deve retornar motorista por nome exato (case-insensitive)', () => {
      const motorista = MotoristaRepository.buscarPorNome('joão silva');
      expect(motorista).toBeDefined();
      expect(motorista.nome).toBe('João Silva');
    });

    it('deve retornar null para nome não encontrado', () => {
      const motorista = MotoristaRepository.buscarPorNome('Maria Santos');
      expect(motorista).toBeNull();
    });
  });
});
