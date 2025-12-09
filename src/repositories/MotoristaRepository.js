const Motorista = require('../models/Motorista');

class MotoristaRepository {
  constructor() {
    this.motoristas = new Map();
    this.nextId = 1;
  }

  // Gerar ID único
  generateId() {
    return (this.nextId++).toString();
  }

  // Criar um novo motorista
  criar(motoristaData) {
    const id = this.generateId();
    const motorista = new Motorista({
      id,
      ...motoristaData,
    });

    this.motoristas.set(id, motorista);
    return motorista.toJSON();
  }

  // Buscar motorista por ID
  buscarPorId(id) {
    const motorista = this.motoristas.get(id);
    return motorista ? motorista.toJSON() : null;
  }

  // Listar todos os motoristas
  listar(filtros = {}) {
    let motoristasArray = Array.from(this.motoristas.values()).map(
      (motorista) => motorista.toJSON()
    );

    // Aplicar filtro por nome
    if (filtros.nome) {
      const termoBusca = filtros.nome.toLowerCase();
      motoristasArray = motoristasArray.filter((motorista) =>
        motorista.nome.toLowerCase().includes(termoBusca)
      );
    }

    return motoristasArray;
  }

  // Atualizar motorista
  atualizar(id, dadosAtualizacao) {
    const motorista = this.motoristas.get(id);

    if (!motorista) {
      return null;
    }

    motorista.update(dadosAtualizacao);
    return motorista.toJSON();
  }

  // Excluir motorista
  excluir(id) {
    const motorista = this.motoristas.get(id);

    if (!motorista) {
      return false;
    }

    this.motoristas.delete(id);
    return true;
  }

  // Verificar se motorista existe
  motoristaExiste(nome, idExcluir = null) {
    for (const [id, motorista] of this.motoristas) {
      if (idExcluir && id === idExcluir) continue;
      if (motorista.nome.toLowerCase() === nome.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  // Buscar por nome exato
  buscarPorNome(nome) {
    for (const motorista of this.motoristas.values()) {
      if (motorista.nome.toLowerCase() === nome.toLowerCase()) {
        return motorista.toJSON();
      }
    }
    return null;
  }

  // Limpar todos os dados (apenas para testes)
  limpar() {
    this.motoristas.clear();
    this.nextId = 1;
  }
}

module.exports = new MotoristaRepository();
