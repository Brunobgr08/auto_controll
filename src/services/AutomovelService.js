const automovelRepository = require('../repositories/AutomovelRepository');
const utilizacaoRepository = require('../repositories/UtilizacaoRepository');
const { AppError } = require('../middlewares/errorHandler');

class AutomovelService {
  // Criar automóvel
  async criar(automovelData) {
    // Verificar se placa já existe
    if (automovelRepository.placaExiste(automovelData.placa)) {
      throw new AppError('Já existe um automóvel com esta placa', 409);
    }

    const automovel = automovelRepository.criar(automovelData);
    return automovel;
  }

  // Buscar automóvel por ID
  async buscarPorId(id) {
    const automovel = automovelRepository.buscarPorId(id);

    if (!automovel) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    return automovel;
  }

  // Listar automóveis
  async listar(filtros = {}) {
    return automovelRepository.listar(filtros);
  }

  // Atualizar automóvel
  async atualizar(id, dadosAtualizacao) {
    // Verificar se automóvel existe
    const automovelExistente = automovelRepository.buscarPorId(id);
    if (!automovelExistente) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    // Se estiver atualizando a placa, verificar se não conflita
    if (
      dadosAtualizacao.placa &&
      automovelRepository.placaExiste(dadosAtualizacao.placa, id)
    ) {
      throw new AppError('Já existe outro automóvel com esta placa', 409);
    }

    const automovelAtualizado = automovelRepository.atualizar(
      id,
      dadosAtualizacao
    );
    return automovelAtualizado;
  }

  // Excluir automóvel
  async excluir(id) {
    // Verificar se automóvel existe
    const automovelExistente = automovelRepository.buscarPorId(id);
    if (!automovelExistente) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    // Verificar se automóvel está em uso
    const automovelEmUso = utilizacaoRepository.automovelEstaEmUso(id);
    if (automovelEmUso) {
      throw new AppError('Não é possível excluir automóvel em uso', 409);
    }

    // Verificar se há utilizações históricas
    const utilizacoesHistorico = utilizacaoRepository.buscarPorAutomovel(id);
    if (utilizacoesHistorico.length > 0) {
      throw new AppError(
        'Não é possível excluir automóvel com histórico de utilizações. Considere desativar em vez de excluir.',
        409
      );
    }

    const excluido = automovelRepository.excluir(id);

    if (!excluido) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    return { message: 'Automóvel excluído com sucesso' };
  }
}

module.exports = new AutomovelService();
