const AutomovelRepository = require('../../src/repositories/AutomovelRepository');
const MotoristaRepository = require('../../src/repositories/MotoristaRepository');
const UtilizacaoRepository = require('../../src/repositories/UtilizacaoRepository');

describe('Otimizações de Performance', () => {
  describe('Repositório de Automóveis', () => {
    beforeEach(() => {
      AutomovelRepository.limpar();
    });

    it('deve usar índice para busca por placa', () => {
      const automovel1 = AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      AutomovelRepository.criar({
        placa: 'XYZ9A87',
        cor: 'Branco',
        marca: 'Honda',
      });

      // Busca deve ser O(1) usando índice
      const encontrado = AutomovelRepository.buscarPorPlaca('ABC1D23');
      expect(encontrado).not.toBeNull();
      expect(encontrado.id).toBe(automovel1.id);
    });

    it('deve atualizar índice ao atualizar placa', () => {
      const automovel = AutomovelRepository.criar({
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      });

      // Atualizar placa
      AutomovelRepository.atualizar(automovel.id, { placa: 'XYZ9A87' });

      // Nova placa deve ser encontrada
      const porNovaPlaca = AutomovelRepository.buscarPorPlaca('XYZ9A87');
      expect(porNovaPlaca).not.toBeNull();

      // Placa antiga não deve ser encontrada
      const porPlacaAntiga = AutomovelRepository.buscarPorPlaca('ABC1D23');
      expect(porPlacaAntiga).toBeNull();
    });
  });

  describe('Repositório de Motoristas', () => {
    beforeEach(() => {
      MotoristaRepository.limpar();
    });

    it('deve usar índice para verificação de nome duplicado', () => {
      MotoristaRepository.criar({ nome: 'João Silva' });

      // Verificação deve ser O(1)
      const existe = MotoristaRepository.motoristaExiste('João Silva');
      expect(existe).toBe(true);
    });
  });

  describe('Repositório de Utilizações', () => {
    beforeEach(() => {
      UtilizacaoRepository.limpar();
    });

    it('deve usar índices para verificar uso ativo', () => {
      UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Teste',
      });

      // Verificações devem ser O(1)
      const automovelEmUso = UtilizacaoRepository.automovelEstaEmUso('1');
      const motoristaEmUso = UtilizacaoRepository.motoristaEstaEmUso('1');
      const existeAtiva = UtilizacaoRepository.existeUtilizacaoAtiva('1', '1');

      expect(automovelEmUso).not.toBeNull();
      expect(motoristaEmUso).not.toBeNull();
      expect(existeAtiva).toBe(true);
    });

    it('deve remover dos índices ao finalizar utilização', () => {
      const utilizacao = UtilizacaoRepository.criar({
        automovelId: '1',
        motoristaId: '1',
        motivo: 'Teste',
      });

      // Deve estar nos índices
      expect(UtilizacaoRepository.automovelEstaEmUso('1')).not.toBeNull();

      // Finalizar
      UtilizacaoRepository.finalizar(utilizacao.id);

      // Não deve mais estar nos índices
      expect(UtilizacaoRepository.automovelEstaEmUso('1')).toBeNull();
      expect(UtilizacaoRepository.motoristaEstaEmUso('1')).toBeNull();
      expect(UtilizacaoRepository.existeUtilizacaoAtiva('1', '1')).toBe(false);
    });
  });
});
