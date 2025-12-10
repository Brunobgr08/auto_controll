const UtilizacaoRepository = require('../../../src/repositories/UtilizacaoRepository');
const AutomovelRepository = require('../../../src/repositories/AutomovelRepository');
const MotoristaRepository = require('../../../src/repositories/MotoristaRepository');

// Mock dos outros repositórios
jest.mock('../../../src/repositories/AutomovelRepository');
jest.mock('../../../src/repositories/MotoristaRepository');

describe('Repositório de Utilizações', () => {
  beforeEach(() => {
    UtilizacaoRepository.limpar();

    // Configurar mocks
    AutomovelRepository.buscarPorId.mockImplementation((id) => {
      const automoveis = {
        1: { id: '1', placa: 'ABC1D23', cor: 'Preto', marca: 'Toyota' },
        2: { id: '2', placa: 'XYZ9A87', cor: 'Branco', marca: 'Honda' },
      };
      return automoveis[id] || null;
    });

    MotoristaRepository.buscarPorId.mockImplementation((id) => {
      const motoristas = {
        1: { id: '1', nome: 'João Silva' },
        2: { id: '2', nome: 'Maria Santos' },
      };
      return motoristas[id] || null;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve criar uma nova utilização', () => {
      const utilizacaoData = {
        automovelId: '1',
        motoristaId: '1',
        dataInicio: '2023-12-08T10:00:00.000Z',
        motivo: 'Viagem a negócios',
      };

      const utilizacao = UtilizacaoRepository.criar(utilizacaoData);

      expect(utilizacao).toHaveProperty('id');
      expect(utilizacao.automovelId).toBe('1');
      expect(utilizacao.motoristaId).toBe('1');
      expect(utilizacao.dataInicio).toBe('2023-12-08T10:00:00.000Z');
      expect(utilizacao.motivo).toBe('Viagem a negócios');
      expect(utilizacao.dataTermino).toBeNull();
    });

    it('deve gerar IDs sequenciais', () => {
      const utilizacao1 = UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 1',
      });

      const utilizacao2 = UtilizacaoRepository.criar({
        automovelId: '2',
        motoristaId: '2',
        motivo: 'Viagem 2',
      });

      expect(utilizacao1.id).toBe('1');
      expect(utilizacao2.id).toBe('2');
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar utilização existente', () => {
      const utilizacaoData = {
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      };

      const utilizacaoCriada = UtilizacaoRepository.criar(utilizacaoData);
      const utilizacaoBuscada = UtilizacaoRepository.buscarPorId(
        utilizacaoCriada.id
      );

      expect(utilizacaoBuscada).toEqual(utilizacaoCriada);
    });

    it('deve retornar null para ID não existente', () => {
      const utilizacao = UtilizacaoRepository.buscarPorId('999');
      expect(utilizacao).toBeNull();
    });
  });

  describe('buscarPorIdCompleto', () => {
    it('deve retornar utilização com detalhes completos', () => {
      const utilizacaoCriada = UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      const utilizacao = UtilizacaoRepository.buscarPorIdCompleto(
        utilizacaoCriada.id,
        AutomovelRepository,
        MotoristaRepository
      );

      expect(utilizacao).toHaveProperty('id', utilizacaoCriada.id);
      expect(utilizacao.automovel).toEqual({
        id: '1',
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });
      expect(utilizacao.motorista).toEqual({
        id: '1',
        nome: 'João Silva',
      });
      expect(utilizacao.ativa).toBe(true);
    });

    it('deve retornar null para ID não existente', () => {
      const utilizacao = UtilizacaoRepository.buscarPorIdCompleto(
        '999',
        AutomovelRepository,
        MotoristaRepository
      );
      expect(utilizacao).toBeNull();
    });
  });

  describe('listar', () => {
    beforeEach(() => {
      // Criar algumas utilizações para teste
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 1',
        dataTermino: '2023-12-08T18:00:00.000Z', // Finalizada
      });

      UtilizacaoRepository.criar({
        automovelId: '2',
        motoristaId: '2',
        motivo: 'Viagem 2',
        // Não tem dataTermino - ativa
      });

      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '2',
        motivo: 'Viagem 3',
        dataTermino: '2023-12-09T18:00:00.000Z', // Finalizada
      });
    });

    it('deve retornar todas as utilizações sem filtros', () => {
      const utilizacoes = UtilizacaoRepository.listar();
      expect(utilizacoes).toHaveLength(3);
    });

    it('deve filtrar por utilizações ativas', () => {
      const utilizacoes = UtilizacaoRepository.listar({ ativa: true });
      expect(utilizacoes).toHaveLength(1);
      expect(utilizacoes[0].dataTermino).toBeNull();
    });

    it('deve filtrar por utilizações finalizadas', () => {
      const utilizacoes = UtilizacaoRepository.listar({ ativa: false });
      expect(utilizacoes).toHaveLength(2);
      expect(utilizacoes.every((u) => u.dataTermino !== null)).toBe(true);
    });
  });

  describe('listarCompleto', () => {
    beforeEach(() => {
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 1',
      });
    });

    it('deve retornar utilizações com detalhes completos', () => {
      const utilizacoes = UtilizacaoRepository.listarCompleto(
        AutomovelRepository,
        MotoristaRepository
      );

      expect(utilizacoes).toHaveLength(1);
      expect(utilizacoes[0]).toHaveProperty('automovel');
      expect(utilizacoes[0]).toHaveProperty('motorista');
      expect(utilizacoes[0].automovel).toEqual({
        id: '1',
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });
    });
  });

  describe('finalizar', () => {
    it('deve finalizar utilização existente', () => {
      const utilizacaoCriada = UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      const dataTermino = '2023-12-08T18:00:00.000Z';
      const finalizada = UtilizacaoRepository.finalizar(
        utilizacaoCriada.id,
        dataTermino
      );

      expect(finalizada.dataTermino).toBe(dataTermino);

      const buscada = UtilizacaoRepository.buscarPorId(utilizacaoCriada.id);
      expect(buscada.dataTermino).toBe(dataTermino);
    });

    it('deve usar data atual se dataTermino não for fornecida', () => {
      const utilizacaoCriada = UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      const finalizada = UtilizacaoRepository.finalizar(utilizacaoCriada.id);

      expect(finalizada.dataTermino).toBeDefined();
      expect(() => new Date(finalizada.dataTermino)).not.toThrow();
    });

    it('deve retornar null para ID não existente', () => {
      const finalizada = UtilizacaoRepository.finalizar('999');
      expect(finalizada).toBeNull();
    });
  });

  describe('excluir', () => {
    it('deve excluir utilização existente', () => {
      const utilizacao = UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      const excluido = UtilizacaoRepository.excluir(utilizacao.id);
      expect(excluido).toBe(true);

      const buscado = UtilizacaoRepository.buscarPorId(utilizacao.id);
      expect(buscado).toBeNull();
    });

    it('deve retornar false para ID não existente', () => {
      const excluido = UtilizacaoRepository.excluir('999');
      expect(excluido).toBe(false);
    });
  });

  describe('automovelEstaEmUso', () => {
    it('deve retornar utilização ativa para automóvel em uso', () => {
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      const emUso = UtilizacaoRepository.automovelEstaEmUso('1');

      expect(emUso).not.toBeNull();
      expect(emUso.automovelId).toBe('1');
      expect(emUso.dataTermino).toBeNull();
    });

    it('deve retornar null para automóvel não em uso', () => {
      const emUso = UtilizacaoRepository.automovelEstaEmUso('999');
      expect(emUso).toBeNull();
    });

    it('deve retornar null para automóvel com utilização finalizada', () => {
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
        dataTermino: '2023-12-08T18:00:00.000Z',
      });

      const emUso = UtilizacaoRepository.automovelEstaEmUso('1');
      expect(emUso).toBeNull();
    });
  });

  describe('motoristaEstaEmUso', () => {
    it('deve retornar utilização ativa para motorista em uso', () => {
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });

      const emUso = UtilizacaoRepository.motoristaEstaEmUso('1');

      expect(emUso).not.toBeNull();
      expect(emUso.motoristaId).toBe('1');
      expect(emUso.dataTermino).toBeNull();
    });

    it('deve retornar null para motorista não em uso', () => {
      const emUso = UtilizacaoRepository.motoristaEstaEmUso('999');
      expect(emUso).toBeNull();
    });
  });

  describe('existeUtilizacaoAtiva', () => {
    beforeEach(() => {
      // Criar uma utilização ativa
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem a negócios',
      });
    });

    it('deve retornar true se automóvel estiver em uso', () => {
      // Automóvel 1 está em uso
      expect(UtilizacaoRepository.existeUtilizacaoAtiva('1', '2')).toBe(true);
    });

    it('deve retornar true se motorista estiver em uso', () => {
      // Motorista 1 está em uso
      expect(UtilizacaoRepository.existeUtilizacaoAtiva('2', '1')).toBe(true);
    });

    it('deve retornar true se ambos estiverem em uso', () => {
      // Ambos estão em uso (mesma utilização)
      expect(UtilizacaoRepository.existeUtilizacaoAtiva('1', '1')).toBe(true);
    });

    it('deve retornar false se nem automóvel nem motorista estiverem em uso', () => {
      expect(UtilizacaoRepository.existeUtilizacaoAtiva('99', '99')).toBe(
        false
      );
    });

    it('deve retornar false para automóvel com utilização finalizada', () => {
      // Criar uma utilização finalizada
      UtilizacaoRepository.criar({
        automovelId: '3',
        motoristaId: '3',
        motivo: 'Viagem finalizada',
        dataTermino: '2023-12-08T18:00:00.000Z',
      });

      expect(UtilizacaoRepository.existeUtilizacaoAtiva('3', '4')).toBe(false);
    });
  });

  describe('buscarPorAutomovel e buscarPorMotorista', () => {
    beforeEach(() => {
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Viagem 1',
      });
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '2',
        motivo: 'Viagem 2',
      });
      UtilizacaoRepository.criar({
        automovelId: '2',
        motoristaId: '1',
        motivo: 'Viagem 3',
      });
    });

    it('deve buscar utilizações por automóvel', () => {
      const utilizacoes = UtilizacaoRepository.buscarPorAutomovel('1');
      expect(utilizacoes).toHaveLength(2);
      expect(utilizacoes.every((u) => u.automovelId === '1')).toBe(true);
    });

    it('deve buscar utilizações por motorista', () => {
      const utilizacoes = UtilizacaoRepository.buscarPorMotorista('1');
      expect(utilizacoes).toHaveLength(2);
      expect(utilizacoes.every((u) => u.motoristaId === '1')).toBe(true);
    });
  });
});
