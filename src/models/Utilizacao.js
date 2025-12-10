class Utilizacao {
  constructor({
    id,
    automovelId,
    motoristaId,
    dataInicio,
    motivo,
    dataTermino = null,
  }) {
    this.id = id;
    this.automovelId = automovelId;
    this.motoristaId = motoristaId;
    this.dataInicio = dataInicio || new Date().toISOString();
    this.motivo = motivo;
    this.dataTermino = dataTermino;
    this.criadoEm = new Date().toISOString();
    this.atualizadoEm = new Date().toISOString();
  }

  finalizar(dataTermino = null) {
    this.dataTermino = dataTermino || new Date().toISOString();
    this.atualizadoEm = new Date().toISOString();
    return this;
  }

  estaAtiva() {
    return this.dataTermino === null;
  }

  toJSON() {
    return {
      id: this.id,
      automovelId: this.automovelId,
      motoristaId: this.motoristaId,
      dataInicio: this.dataInicio,
      motivo: this.motivo,
      dataTermino: this.dataTermino,
      criadoEm: this.criadoEm,
      atualizadoEm: this.atualizadoEm,
    };
  }

  toJSONCompleto(automovel, motorista) {
    return {
      id: this.id,
      automovel: automovel
        ? {
            id: automovel.id,
            placa: automovel.placa,
            cor: automovel.cor,
            marca: automovel.marca,
          }
        : { id: this.automovelId },
      motorista: motorista
        ? {
            id: motorista.id,
            nome: motorista.nome,
          }
        : { id: this.motoristaId },
      dataInicio: this.dataInicio,
      motivo: this.motivo,
      dataTermino: this.dataTermino,
      criadoEm: this.criadoEm,
      atualizadoEm: this.atualizadoEm,
      ativa: this.estaAtiva(),
    };
  }
}

module.exports = Utilizacao;
