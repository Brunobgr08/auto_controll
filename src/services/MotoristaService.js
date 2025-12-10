const motoristaRepository = require('../repositories/MotoristaRepository');
const utilizacaoRepository = require('../repositories/UtilizacaoRepository');
const { NotFoundError, ConflictError } = require('../middlewares/errorHandler');
const { MESSAGES } = require('../constants/app');

class MotoristaService {
  async criar(motoristaData) {
    if (motoristaRepository.motoristaExiste(motoristaData.nome)) {
      throw new ConflictError(MESSAGES.CONFLICT.NOME_DUPLICADO);
    }

    const motorista = motoristaRepository.criar(motoristaData);
    return motorista;
  }

  async buscarPorId(id) {
    const motorista = motoristaRepository.buscarPorId(id);

    if (!motorista) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.MOTORISTA, { id });
    }

    return motorista;
  }

  async listar(filtros = {}) {
    return motoristaRepository.listar(filtros);
  }

  async atualizar(id, dadosAtualizacao) {
    const motoristaExistente = motoristaRepository.buscarPorId(id);
    if (!motoristaExistente) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.MOTORISTA, { id });
    }

    if (
      dadosAtualizacao.nome &&
      motoristaRepository.motoristaExiste(dadosAtualizacao.nome, id)
    ) {
      throw new ConflictError(MESSAGES.CONFLICT.NOME_DUPLICADO, {
        nome: dadosAtualizacao.nome,
      });
    }

    const motoristaAtualizado = motoristaRepository.atualizar(
      id,
      dadosAtualizacao
    );
    return motoristaAtualizado;
  }

  async excluir(id) {
    const motoristaExistente = motoristaRepository.buscarPorId(id);
    if (!motoristaExistente) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.MOTORISTA, { id });
    }

    const motoristaEmUso = utilizacaoRepository.motoristaEstaEmUso(id);
    if (motoristaEmUso) {
      throw new ConflictError(MESSAGES.CONFLICT.MOTORISTA_EM_USO, {
        utilizacaoId: motoristaEmUso.id,
      });
    }

    const utilizacoesHistorico = utilizacaoRepository.buscarPorMotorista(id);
    if (utilizacoesHistorico.length > 0) {
      throw new ConflictError(MESSAGES.CONFLICT.MOTORISTA_COM_HISTORICO, {
        quantidadeUtilizacoes: utilizacoesHistorico.length,
      });
    }

    const excluido = motoristaRepository.excluir(id);

    if (!excluido) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.MOTORISTA, { id });
    }

    return {
      message: 'Motorista excluído com sucesso',
      id,
    };
  }
}

module.exports = new MotoristaService();
