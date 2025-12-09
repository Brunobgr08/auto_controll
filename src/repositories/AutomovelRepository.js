const Automovel = require('../models/Automovel');

class AutomovelRepository {
  constructor() {
    // Banco de dados em memória
    this.automoveis = new Map();
    this.nextId = 1;
  }

  // Gerar ID único
  generateId() {
    return (this.nextId++).toString();
  }

  // Criar um novo automóvel
  criar(automovelData) {
    const id = this.generateId();
    const automovel = new Automovel({
      id,
      ...automovelData,
    });

    this.automoveis.set(id, automovel);
    return automovel.toJSON();
  }

  // Buscar automóvel por ID
  buscarPorId(id) {
    const automovel = this.automoveis.get(id);
    return automovel ? automovel.toJSON() : null;
  }

  // Listar todos os automóveis
  listar(filtros = {}) {
    let automoveisArray = Array.from(this.automoveis.values()).map((auto) =>
      auto.toJSON()
    );

    // Aplicar filtros
    if (filtros.cor) {
      automoveisArray = automoveisArray.filter(
        (auto) => auto.cor.toLowerCase() === filtros.cor.toLowerCase()
      );
    }

    if (filtros.marca) {
      automoveisArray = automoveisArray.filter(
        (auto) => auto.marca.toLowerCase() === filtros.marca.toLowerCase()
      );
    }

    return automoveisArray;
  }

  // Atualizar automóvel
  atualizar(id, dadosAtualizacao) {
    const automovel = this.automoveis.get(id);

    if (!automovel) {
      return null;
    }

    automovel.update(dadosAtualizacao);
    return automovel.toJSON();
  }

  // Excluir automóvel
  excluir(id) {
    const automovel = this.automoveis.get(id);

    if (!automovel) {
      return false;
    }

    this.automoveis.delete(id);
    return true;
  }

  // Verificar se placa já existe
  placaExiste(placa, idExcluir = null) {
    for (const [id, automovel] of this.automoveis) {
      if (idExcluir && id === idExcluir) continue;
      if (automovel.placa === placa) {
        return true;
      }
    }
    return false;
  }

  // Buscar por placa
  buscarPorPlaca(placa) {
    for (const automovel of this.automoveis.values()) {
      if (automovel.placa === placa) {
        return automovel.toJSON();
      }
    }
    return null;
  }

  // Limpar todos os dados (apenas para testes)
  limpar() {
    this.automoveis.clear();
    this.nextId = 1;
  }
}

module.exports = new AutomovelRepository();
