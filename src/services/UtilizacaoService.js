const utilizacaoRepository = require('../repositories/UtilizacaoRepository');
const automovelRepository = require('../repositories/AutomovelRepository');
const motoristaRepository = require('../repositories/MotoristaRepository');
const { AppError } = require('../middlewares/errorHandler');

class UtilizacaoService {
  constructor() {
    this.utilizacaoRepo = utilizacaoRepository;
    this.automovelRepo = automovelRepository;
    this.motoristaRepo = motoristaRepository;
  }

  // Criar utilização
  async criar(utilizacaoData) {
    // Verificar se automóvel existe
    const automovel = this.automovelRepo.buscarPorId(
      utilizacaoData.automovelId
    );
    if (!automovel) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    // Verificar se motorista existe
    const motorista = this.motoristaRepo.buscarPorId(
      utilizacaoData.motoristaId
    );
    if (!motorista) {
      throw new AppError('Motorista não encontrado', 404);
    }

    // Verificar regras de negócio
    if (
      this.utilizacaoRepo.existeUtilizacaoAtiva(
        utilizacaoData.automovelId,
        utilizacaoData.motoristaId
      )
    ) {
      // Verificar qual está em uso para dar mensagem mais específica
      const automovelEmUso = this.utilizacaoRepo.automovelEstaEmUso(
        utilizacaoData.automovelId
      );
      if (automovelEmUso) {
        throw new AppError('Automóvel já está em uso', 409);
      }

      const motoristaEmUso = this.utilizacaoRepo.motoristaEstaEmUso(
        utilizacaoData.motoristaId
      );
      if (motoristaEmUso) {
        throw new AppError('Motorista já está utilizando outro automóvel', 409);
      }
    }

    const utilizacao = this.utilizacaoRepo.criar(utilizacaoData);
    return utilizacao;
  }

  // Buscar utilização por ID
  async buscarPorId(id) {
    const utilizacao = this.utilizacaoRepo.buscarPorIdCompleto(
      id,
      this.automovelRepo,
      this.motoristaRepo
    );

    if (!utilizacao) {
      throw new AppError('Utilização não encontrada', 404);
    }

    return utilizacao;
  }

  // Listar utilizações
  async listar(filtros = {}) {
    return this.utilizacaoRepo.listarCompleto(
      this.automovelRepo,
      this.motoristaRepo,
      filtros
    );
  }

  // Finalizar utilização
  async finalizar(id, dataTermino) {
    const utilizacao = this.utilizacaoRepo.buscarPorId(id);

    if (!utilizacao) {
      throw new AppError('Utilização não encontrada', 404);
    }

    if (utilizacao.dataTermino) {
      throw new AppError('Utilização já foi finalizada', 400);
    }

    const utilizacaoFinalizada = this.utilizacaoRepo.finalizar(id, dataTermino);

    // Retornar com dados completos
    return this.utilizacaoRepo.buscarPorIdCompleto(
      id,
      this.automovelRepo,
      this.motoristaRepo
    );
  }

  // Excluir utilização
  async excluir(id) {
    const excluido = this.utilizacaoRepo.excluir(id);

    if (!excluido) {
      throw new AppError('Utilização não encontrada', 404);
    }

    return { message: 'Utilização excluída com sucesso' };
  }

  // Verificar se automóvel está em uso
  async automovelEstaEmUso(automovelId) {
    // Verificar se automóvel existe
    const automovel = this.automovelRepo.buscarPorId(automovelId);
    if (!automovel) {
      throw new AppError('Automóvel não encontrado', 404);
    }

    const utilizacao = this.utilizacaoRepo.automovelEstaEmUso(automovelId);
    return {
      emUso: !!utilizacao,
      utilizacao: utilizacao || null,
    };
  }

  // Verificar se motorista está em uso
  async motoristaEstaEmUso(motoristaId) {
    // Verificar se motorista existe
    const motorista = this.motoristaRepo.buscarPorId(motoristaId);
    if (!motorista) {
      throw new AppError('Motorista não encontrado', 404);
    }

    const utilizacao = this.utilizacaoRepo.motoristaEstaEmUso(motoristaId);
    return {
      emUso: !!utilizacao,
      utilizacao: utilizacao || null,
    };
  }
}

module.exports = new UtilizacaoService();
