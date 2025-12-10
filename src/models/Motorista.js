class Motorista {
  constructor({ id, nome }) {
    this.id = id;
    this.nome = nome;
    this.criadoEm = new Date().toISOString();
    this.atualizadoEm = new Date().toISOString();
  }

  update(data) {
    const fields = ['nome'];
    fields.forEach((field) => {
      if (data[field] !== undefined) {
        this[field] = data[field];
      }
    });
    this.atualizadoEm = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      criadoEm: this.criadoEm,
      atualizadoEm: this.atualizadoEm,
    };
  }
}

module.exports = Motorista;
