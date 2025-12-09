const AutomovelRepository = require('../../../src/repositories/AutomovelRepository');

describe('Repositório de Automóveis', () => {
  beforeEach(() => {
    AutomovelRepository.limpar();
  });

  describe('criar', () => {
    it('deve criar um novo automóvel', () => {
      const automovelData = {
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      };

      const automovel = AutomovelRepository.criar(automovelData);

      expect(automovel).toHaveProperty('id');
      expect(automovel.placa).toBe('ABC1D23');
      expect(automovel.cor).toBe('Preto');
      expect(automovel.marca).toBe('Toyota');
      expect(automovel.criadoEm).toBeDefined();
    });

    it('deve gerar IDs sequenciais', () => {
      const automovel1 = AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });
      const automovel2 = AutomovelRepository.criar({
        placa: 'XYZ9A87',
        cor: 'Branco',
        marca: 'Honda',
      });

      expect(automovel1.id).toBe('1');
      expect(automovel2.id).toBe('2');
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar automóvel existente', () => {
      const automovelData = {
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      };

      const automovelCriado = AutomovelRepository.criar(automovelData);
      const automovelBuscado = AutomovelRepository.buscarPorId(
        automovelCriado.id
      );

      expect(automovelBuscado).toEqual(automovelCriado);
    });

    it('deve retornar null para ID não existente', () => {
      const automovel = AutomovelRepository.buscarPorId('999');
      expect(automovel).toBeNull();
    });
  });

  describe('listar', () => {
    beforeEach(() => {
      AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });
      AutomovelRepository.criar({
        placa: 'XYZ9A87',
        cor: 'Branco',
        marca: 'Honda',
      });
      AutomovelRepository.criar({
        placa: 'DEF4G56',
        cor: 'Preto',
        marca: 'Ford',
      });
    });

    it('deve retornar todos os automóveis sem filtros', () => {
      const automoveis = AutomovelRepository.listar();
      expect(automoveis).toHaveLength(3);
    });

    it('deve filtrar por cor', () => {
      const automoveis = AutomovelRepository.listar({ cor: 'Preto' });
      expect(automoveis).toHaveLength(2);
      expect(automoveis.every((auto) => auto.cor === 'Preto')).toBe(true);
    });

    it('deve filtrar por marca', () => {
      const automoveis = AutomovelRepository.listar({ marca: 'Toyota' });
      expect(automoveis).toHaveLength(1);
      expect(automoveis[0].marca).toBe('Toyota');
    });

    it('deve filtrar por cor e marca simultaneamente', () => {
      const automoveis = AutomovelRepository.listar({
        cor: 'Preto',
        marca: 'Toyota',
      });
      expect(automoveis).toHaveLength(1);
      expect(automoveis[0].cor).toBe('Preto');
      expect(automoveis[0].marca).toBe('Toyota');
    });

    it('deve retornar array vazio para filtro sem resultados', () => {
      const automoveis = AutomovelRepository.listar({ cor: 'Azul' });
      expect(automoveis).toHaveLength(0);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar automóvel existente', () => {
      const automovelCriado = AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      // Mock do Date para garantir timestamp diferente
      const originalDate = global.Date;
      const mockDate = new Date('2023-12-08T18:30:00.000Z');
      global.Date = class extends Date {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
      };

      const atualizado = AutomovelRepository.atualizar(automovelCriado.id, {
        cor: 'Branco',
        marca: 'Honda',
      });

      // Restaurar Date original
      global.Date = originalDate;

      expect(atualizado.cor).toBe('Branco');
      expect(atualizado.marca).toBe('Honda');
      expect(atualizado.placa).toBe('ABC1D23');
      expect(atualizado.atualizadoEm).toBe('2023-12-08T18:30:00.000Z');
    });

    it('deve retornar null para ID não existente', () => {
      const atualizado = AutomovelRepository.atualizar('999', { cor: 'Azul' });
      expect(atualizado).toBeNull();
    });
  });

  describe('excluir', () => {
    it('deve excluir automóvel existente', () => {
      const automovel = AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      const excluido = AutomovelRepository.excluir(automovel.id);
      expect(excluido).toBe(true);

      const buscado = AutomovelRepository.buscarPorId(automovel.id);
      expect(buscado).toBeNull();
    });

    it('deve retornar false para ID não existente', () => {
      const excluido = AutomovelRepository.excluir('999');
      expect(excluido).toBe(false);
    });
  });

  describe('placaExiste', () => {
    beforeEach(() => {
      AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });
    });

    it('deve retornar true para placa existente', () => {
      const existe = AutomovelRepository.placaExiste('ABC1D23');
      expect(existe).toBe(true);
    });

    it('deve retornar false para placa inexistente', () => {
      const existe = AutomovelRepository.placaExiste('XYZ9A87');
      expect(existe).toBe(false);
    });

    it('deve ignorar o próprio automóvel quando especificado', () => {
      const automovel = AutomovelRepository.buscarPorPlaca('ABC1D23');
      const existe = AutomovelRepository.placaExiste('ABC1D23', automovel.id);
      expect(existe).toBe(false);
    });
  });
});
