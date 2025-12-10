const automovelRepository = require('../repositories/AutomovelRepository');
const utilizacaoRepository = require('../repositories/UtilizacaoRepository');
const { NotFoundError, ConflictError } = require('../middlewares/errorHandler');
const { MESSAGES } = require('../constants/app');

class AutomovelService {
  async criar(automovelData) {
    if (automovelRepository.placaExiste(automovelData.placa)) {
      throw new ConflictError(MESSAGES.CONFLICT.PLACA_DUPLICADA);
    }

    const automovel = automovelRepository.criar(automovelData);
    return automovel;
  }

  async buscarPorId(id) {
    const automovel = automovelRepository.buscarPorId(id);

    if (!automovel) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.AUTOMOVEL, { id });
    }

    return automovel;
  }

  async listar(filtros = {}) {
    return automovelRepository.listar(filtros);
  }

  async atualizar(id, dadosAtualizacao) {
    const automovelExistente = automovelRepository.buscarPorId(id);
    if (!automovelExistente) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.AUTOMOVEL, { id });
    }

    if (
      dadosAtualizacao.placa &&
      automovelRepository.placaExiste(dadosAtualizacao.placa, id)
    ) {
      throw new ConflictError(MESSAGES.CONFLICT.PLACA_DUPLICADA, {
        placa: dadosAtualizacao.placa,
      });
    }

    const automovelAtualizado = automovelRepository.atualizar(
      id,
      dadosAtualizacao
    );
    return automovelAtualizado;
  }

  async excluir(id) {
    const automovelExistente = automovelRepository.buscarPorId(id);
    if (!automovelExistente) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.AUTOMOVEL, { id });
    }

    const automovelEmUso = utilizacaoRepository.automovelEstaEmUso(id);
    if (automovelEmUso) {
      throw new ConflictError(MESSAGES.CONFLICT.AUTOMOVEL_EM_USO, {
        utilizacaoId: automovelEmUso.id,
      });
    }

    const utilizacoesHistorico = utilizacaoRepository.buscarPorAutomovel(id);
    if (utilizacoesHistorico.length > 0) {
      throw new ConflictError(MESSAGES.CONFLICT.AUTOMOVEL_COM_HISTORICO, {
        quantidadeUtilizacoes: utilizacoesHistorico.length,
      });
    }

    const excluido = automovelRepository.excluir(id);

    if (!excluido) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.AUTOMOVEL, { id });
    }

    return {
      message: 'Automóvel excluído com sucesso',
      id,
    };
  }
}

module.exports = new AutomovelService();
