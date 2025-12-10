const Utilizacao = require('../models/Utilizacao');

class UtilizacaoRepository {
  constructor() {
    this.utilizacoes = new Map();
    this.nextId = 1;
    this.automovelEmUsoIndex = new Map(); // automovelId -> utilizacaoId (apenas ativas)
    this.motoristaEmUsoIndex = new Map(); // motoristaId -> utilizacaoId (apenas ativas)
  }

  generateId() {
    return (this.nextId++).toString();
  }

  criar(utilizacaoData) {
    const id = this.generateId();
    const utilizacao = new Utilizacao({
      id,
      ...utilizacaoData,
    });

    this.utilizacoes.set(id, utilizacao);

    // Atualizar índices de uso
    if (utilizacao.estaAtiva()) {
      this.automovelEmUsoIndex.set(utilizacao.automovelId, id);
      this.motoristaEmUsoIndex.set(utilizacao.motoristaId, id);
    }

    return utilizacao.toJSON();
  }

  buscarPorId(id) {
    const utilizacao = this.utilizacoes.get(id);
    return utilizacao ? utilizacao.toJSON() : null;
  }

  buscarPorIdCompleto(id, automovelRepository, motoristaRepository) {
    const utilizacao = this.utilizacoes.get(id);
    if (!utilizacao) return null;

    const automovel = automovelRepository.buscarPorId(utilizacao.automovelId);
    const motorista = motoristaRepository.buscarPorId(utilizacao.motoristaId);

    return utilizacao.toJSONCompleto(automovel, motorista);
  }

  listar(filtros = {}) {
    let utilizacoesArray = Array.from(this.utilizacoes.values()).map(
      (utilizacao) => utilizacao.toJSON()
    );

    // Aplicar filtros
    if (filtros.ativa !== undefined) {
      utilizacoesArray = utilizacoesArray.filter(
        (utilizacao) => (utilizacao.dataTermino === null) === filtros.ativa
      );
    }

    return utilizacoesArray;
  }

  listarCompleto(automovelRepository, motoristaRepository, filtros = {}) {
    let utilizacoesArray = Array.from(this.utilizacoes.values());

    // Aplicar filtros
    if (filtros.ativa !== undefined) {
      utilizacoesArray = utilizacoesArray.filter(
        (utilizacao) => utilizacao.estaAtiva() === filtros.ativa
      );
    }

    return utilizacoesArray.map((utilizacao) => {
      const automovel = automovelRepository.buscarPorId(utilizacao.automovelId);
      const motorista = motoristaRepository.buscarPorId(utilizacao.motoristaId);
      return utilizacao.toJSONCompleto(automovel, motorista);
    });
  }

  finalizar(id, dataTermino = null) {
    const utilizacao = this.utilizacoes.get(id);

    if (!utilizacao) {
      return null;
    }

    // Remover dos índices de uso
    if (utilizacao.estaAtiva()) {
      this.automovelEmUsoIndex.delete(utilizacao.automovelId);
      this.motoristaEmUsoIndex.delete(utilizacao.motoristaId);
    }

    utilizacao.finalizar(dataTermino);
    return utilizacao.toJSON();
  }

  excluir(id) {
    const utilizacao = this.utilizacoes.get(id);

    if (!utilizacao) {
      return false;
    }

    // Remover dos índices de uso
    if (utilizacao.estaAtiva()) {
      this.automovelEmUsoIndex.delete(utilizacao.automovelId);
      this.motoristaEmUsoIndex.delete(utilizacao.motoristaId);
    }

    this.utilizacoes.delete(id);
    return true;
  }

  // Consultas otimizadas usando índices
  automovelEstaEmUso(automovelId) {
    const utilizacaoId = this.automovelEmUsoIndex.get(automovelId);
    if (!utilizacaoId) return null;

    const utilizacao = this.utilizacoes.get(utilizacaoId);
    return utilizacao ? utilizacao.toJSON() : null;
  }

  motoristaEstaEmUso(motoristaId) {
    const utilizacaoId = this.motoristaEmUsoIndex.get(motoristaId);
    if (!utilizacaoId) return null;

    const utilizacao = this.utilizacoes.get(utilizacaoId);
    return utilizacao ? utilizacao.toJSON() : null;
  }

  existeUtilizacaoAtiva(automovelId, motoristaId) {
    return (
      !!this.automovelEmUsoIndex.get(automovelId) ||
      !!this.motoristaEmUsoIndex.get(motoristaId)
    );
  }

  buscarPorAutomovel(automovelId) {
    const result = [];
    for (const utilizacao of this.utilizacoes.values()) {
      if (utilizacao.automovelId === automovelId) {
        result.push(utilizacao.toJSON());
      }
    }
    return result;
  }

  buscarPorMotorista(motoristaId) {
    const result = [];
    for (const utilizacao of this.utilizacoes.values()) {
      if (utilizacao.motoristaId === motoristaId) {
        result.push(utilizacao.toJSON());
      }
    }
    return result;
  }

  limpar() {
    this.utilizacoes.clear();
    this.automovelEmUsoIndex.clear();
    this.motoristaEmUsoIndex.clear();
    this.nextId = 1;
  }
}

module.exports = new UtilizacaoRepository();
