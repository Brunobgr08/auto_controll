const Automovel = require('../models/Automovel');

class AutomovelRepository {
  constructor() {
    this.automoveis = new Map();
    this.nextId = 1;
    this.placaIndex = new Map(); // Índice para busca rápida por placa
  }

  generateId() {
    return (this.nextId++).toString();
  }

  criar(automovelData) {
    const id = this.generateId();
    const automovel = new Automovel({
      id,
      ...automovelData,
    });

    this.automoveis.set(id, automovel);
    this.placaIndex.set(automovel.placa.toLowerCase(), id);
    return automovel.toJSON();
  }

  buscarPorId(id) {
    const automovel = this.automoveis.get(id);
    return automovel ? automovel.toJSON() : null;
  }

  listar(filtros = {}) {
    let automoveisArray = Array.from(this.automoveis.values()).map((auto) =>
      auto.toJSON()
    );

    // Aplicar filtros de forma mais eficiente
    if (filtros.cor || filtros.marca) {
      automoveisArray = automoveisArray.filter((auto) => {
        const corMatch =
          !filtros.cor || auto.cor.toLowerCase() === filtros.cor.toLowerCase();
        const marcaMatch =
          !filtros.marca ||
          auto.marca.toLowerCase() === filtros.marca.toLowerCase();
        return corMatch && marcaMatch;
      });
    }

    return automoveisArray;
  }

  atualizar(id, dadosAtualizacao) {
    const automovel = this.automoveis.get(id);

    if (!automovel) {
      return null;
    }

    // Atualizar índice de placa se necessário
    if (dadosAtualizacao.placa && dadosAtualizacao.placa !== automovel.placa) {
      this.placaIndex.delete(automovel.placa.toLowerCase());
      this.placaIndex.set(dadosAtualizacao.placa.toLowerCase(), id);
    }

    automovel.update(dadosAtualizacao);
    return automovel.toJSON();
  }

  excluir(id) {
    const automovel = this.automoveis.get(id);

    if (!automovel) {
      return false;
    }

    // Remover dos índices
    this.placaIndex.delete(automovel.placa.toLowerCase());
    this.automoveis.delete(id);
    return true;
  }

  placaExiste(placa, idExcluir = null) {
    const placaLower = placa.toLowerCase();
    const idEncontrado = this.placaIndex.get(placaLower);

    if (!idEncontrado) {
      return false;
    }

    if (idExcluir && idEncontrado === idExcluir) {
      return false;
    }

    return true;
  }

  buscarPorPlaca(placa) {
    const id = this.placaIndex.get(placa.toLowerCase());
    if (!id) {
      return null;
    }

    const automovel = this.automoveis.get(id);
    return automovel ? automovel.toJSON() : null;
  }

  limpar() {
    this.automoveis.clear();
    this.placaIndex.clear();
    this.nextId = 1;
  }
}

module.exports = new AutomovelRepository();
