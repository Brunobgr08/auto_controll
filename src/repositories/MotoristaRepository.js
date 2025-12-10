const Motorista = require('../models/Motorista');

class MotoristaRepository {
  constructor() {
    this.motoristas = new Map();
    this.nextId = 1;
    this.nomeIndex = new Map(); // Índice para busca rápida por nome (lowercase)
  }

  generateId() {
    return (this.nextId++).toString();
  }

  criar(motoristaData) {
    const id = this.generateId();
    const motorista = new Motorista({
      id,
      ...motoristaData,
    });

    this.motoristas.set(id, motorista);
    this.nomeIndex.set(motorista.nome.toLowerCase(), id);
    return motorista.toJSON();
  }

  buscarPorId(id) {
    const motorista = this.motoristas.get(id);
    return motorista ? motorista.toJSON() : null;
  }

  listar(filtros = {}) {
    let motoristasArray = Array.from(this.motoristas.values()).map(
      (motorista) => motorista.toJSON()
    );

    // Aplicar filtro por nome de forma eficiente
    if (filtros.nome) {
      const termoBusca = filtros.nome.toLowerCase();
      motoristasArray = motoristasArray.filter((motorista) =>
        motorista.nome.toLowerCase().includes(termoBusca)
      );
    }

    return motoristasArray;
  }

  atualizar(id, dadosAtualizacao) {
    const motorista = this.motoristas.get(id);

    if (!motorista) {
      return null;
    }

    // Atualizar índice de nome se necessário
    if (dadosAtualizacao.nome && dadosAtualizacao.nome !== motorista.nome) {
      this.nomeIndex.delete(motorista.nome.toLowerCase());
      this.nomeIndex.set(dadosAtualizacao.nome.toLowerCase(), id);
    }

    motorista.update(dadosAtualizacao);
    return motorista.toJSON();
  }

  excluir(id) {
    const motorista = this.motoristas.get(id);

    if (!motorista) {
      return false;
    }

    // Remover dos índices
    this.nomeIndex.delete(motorista.nome.toLowerCase());
    this.motoristas.delete(id);
    return true;
  }

  motoristaExiste(nome, idExcluir = null) {
    const nomeLower = nome.toLowerCase();
    const idEncontrado = this.nomeIndex.get(nomeLower);

    if (!idEncontrado) {
      return false;
    }

    if (idExcluir && idEncontrado === idExcluir) {
      return false;
    }

    return true;
  }

  buscarPorNome(nome) {
    const id = this.nomeIndex.get(nome.toLowerCase());
    if (!id) {
      return null;
    }

    const motorista = this.motoristas.get(id);
    return motorista ? motorista.toJSON() : null;
  }

  limpar() {
    this.motoristas.clear();
    this.nomeIndex.clear();
    this.nextId = 1;
  }
}

module.exports = new MotoristaRepository();
