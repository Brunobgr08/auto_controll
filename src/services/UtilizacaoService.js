const utilizacaoRepository = require('../repositories/UtilizacaoRepository');
const automovelRepository = require('../repositories/AutomovelRepository');
const motoristaRepository = require('../repositories/MotoristaRepository');
const { NotFoundError, ConflictError } = require('../middlewares/errorHandler');
const { MESSAGES } = require('../constants/app');

class UtilizacaoService {
  constructor() {
    this.utilizacaoRepo = utilizacaoRepository;
    this.automovelRepo = automovelRepository;
    this.motoristaRepo = motoristaRepository;
  }

  async criar(utilizacaoData) {
    const automovel = this.automovelRepo.buscarPorId(
      utilizacaoData.automovelId
    );
    if (!automovel) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.AUTOMOVEL, {
        automovelId: utilizacaoData.automovelId,
      });
    }

    const motorista = this.motoristaRepo.buscarPorId(
      utilizacaoData.motoristaId
    );
    if (!motorista) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.MOTORISTA, {
        motoristaId: utilizacaoData.motoristaId,
      });
    }

    const automovelEmUso = this.utilizacaoRepo.automovelEstaEmUso(
      utilizacaoData.automovelId
    );
    if (automovelEmUso) {
      throw new ConflictError(MESSAGES.CONFLICT.AUTOMOVEL_EM_USO, {
        utilizacaoId: automovelEmUso.id,
        motoristaId: automovelEmUso.motoristaId,
      });
    }

    const motoristaEmUso = this.utilizacaoRepo.motoristaEstaEmUso(
      utilizacaoData.motoristaId
    );
    if (motoristaEmUso) {
      throw new ConflictError(MESSAGES.CONFLICT.MOTORISTA_EM_USO, {
        utilizacaoId: motoristaEmUso.id,
        automovelId: motoristaEmUso.automovelId,
      });
    }

    const utilizacao = this.utilizacaoRepo.criar(utilizacaoData);
    return utilizacao;
  }

  async buscarPorId(id) {
    const utilizacao = this.utilizacaoRepo.buscarPorIdCompleto(
      id,
      this.automovelRepo,
      this.motoristaRepo
    );

    if (!utilizacao) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.UTILIZACAO, { id });
    }

    return utilizacao;
  }

  async listar(filtros = {}) {
    return this.utilizacaoRepo.listarCompleto(
      this.automovelRepo,
      this.motoristaRepo,
      filtros
    );
  }

  async finalizar(id, dataTermino) {
    const utilizacao = this.utilizacaoRepo.buscarPorId(id);

    if (!utilizacao) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.UTILIZACAO, { id });
    }

    if (utilizacao.dataTermino) {
      throw new ConflictError(MESSAGES.CONFLICT.UTILIZACAO_FINALIZADA, {
        dataTermino: utilizacao.dataTermino,
      });
    }

    this.utilizacaoRepo.finalizar(id, dataTermino);

    return this.utilizacaoRepo.buscarPorIdCompleto(
      id,
      this.automovelRepo,
      this.motoristaRepo
    );
  }

  async excluir(id) {
    const utilizacao = this.utilizacaoRepo.buscarPorId(id);
    if (!utilizacao) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.UTILIZACAO, { id });
    }

    if (!utilizacao.dataTermino) {
      throw new ConflictError(MESSAGES.CONFLICT.UTILIZACAO_ATIVA);
    }

    const excluido = this.utilizacaoRepo.excluir(id);

    if (!excluido) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.UTILIZACAO, { id });
    }

    return {
      message: 'Utilização excluída com sucesso',
      id,
    };
  }

  async automovelEstaEmUso(automovelId) {
    const automovel = this.automovelRepo.buscarPorId(automovelId);
    if (!automovel) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.AUTOMOVEL, { automovelId });
    }

    const utilizacao = this.utilizacaoRepo.automovelEstaEmUso(automovelId);
    return {
      emUso: !!utilizacao,
      utilizacao: utilizacao || null,
      automovel,
    };
  }

  async motoristaEstaEmUso(motoristaId) {
    const motorista = this.motoristaRepo.buscarPorId(motoristaId);
    if (!motorista) {
      throw new NotFoundError(MESSAGES.NOT_FOUND.MOTORISTA, { motoristaId });
    }

    const utilizacao = this.utilizacaoRepo.motoristaEstaEmUso(motoristaId);
    return {
      emUso: !!utilizacao,
      utilizacao: utilizacao || null,
      motorista,
    };
  }
}

module.exports = new UtilizacaoService();
