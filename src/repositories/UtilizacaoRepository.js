const Utilizacao = require('../models/Utilizacao');

class UtilizacaoRepository {
  constructor() {
    this.utilizacoes = new Map();
    this.nextId = 1;
  }

  // Gerar ID único
  generateId() {
    return (this.nextId++).toString();
  }

  // Criar uma nova utilização
  criar(utilizacaoData) {
    const id = this.generateId();
    const utilizacao = new Utilizacao({
      id,
      ...utilizacaoData,
    });

    this.utilizacoes.set(id, utilizacao);
    return utilizacao.toJSON();
  }

  // Buscar utilização por ID
  buscarPorId(id) {
    const utilizacao = this.utilizacoes.get(id);
    return utilizacao ? utilizacao.toJSON() : null;
  }

  // Buscar utilização por ID com detalhes completos
  buscarPorIdCompleto(id, automovelRepository, motoristaRepository) {
    const utilizacao = this.utilizacoes.get(id);
    if (!utilizacao) return null;

    const automovel = automovelRepository.buscarPorId(utilizacao.automovelId);
    const motorista = motoristaRepository.buscarPorId(utilizacao.motoristaId);

    return utilizacao.toJSONCompleto(automovel, motorista);
  }

  // Listar todas as utilizações
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

  // Listar utilizações com detalhes completos
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

  // Finalizar utilização
  finalizar(id, dataTermino = null) {
    const utilizacao = this.utilizacoes.get(id);

    if (!utilizacao) {
      return null;
    }

    utilizacao.finalizar(dataTermino);
    return utilizacao.toJSON();
  }

  // Excluir utilização
  excluir(id) {
    const utilizacao = this.utilizacoes.get(id);

    if (!utilizacao) {
      return false;
    }

    this.utilizacoes.delete(id);
    return true;
  }

  // Verificar se automóvel está em uso
  automovelEstaEmUso(automovelId) {
    for (const utilizacao of this.utilizacoes.values()) {
      if (utilizacao.automovelId === automovelId && utilizacao.estaAtiva()) {
        return utilizacao.toJSON();
      }
    }
    return null;
  }

  // Verificar se motorista está utilizando algum automóvel
  motoristaEstaEmUso(motoristaId) {
    for (const utilizacao of this.utilizacoes.values()) {
      if (utilizacao.motoristaId === motoristaId && utilizacao.estaAtiva()) {
        return utilizacao.toJSON();
      }
    }
    return null;
  }

  // Verificar se existe utilização ativa para automóvel ou motorista
  existeUtilizacaoAtiva(automovelId, motoristaId) {
    return (
      !!this.automovelEstaEmUso(automovelId) ||
      !!this.motoristaEstaEmUso(motoristaId)
    );
  }

  // Buscar utilizações por automóvel
  buscarPorAutomovel(automovelId) {
    const result = [];
    for (const utilizacao of this.utilizacoes.values()) {
      if (utilizacao.automovelId === automovelId) {
        result.push(utilizacao.toJSON());
      }
    }
    return result;
  }

  // Buscar utilizações por motorista
  buscarPorMotorista(motoristaId) {
    const result = [];
    for (const utilizacao of this.utilizacoes.values()) {
      if (utilizacao.motoristaId === motoristaId) {
        result.push(utilizacao.toJSON());
      }
    }
    return result;
  }

  // Limpar todos os dados (apenas para testes)
  limpar() {
    this.utilizacoes.clear();
    this.nextId = 1;
  }
}

module.exports = new UtilizacaoRepository();
