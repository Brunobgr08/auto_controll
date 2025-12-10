class Automovel {
  constructor({ id, placa, cor, marca }) {
    this.id = id;
    this.placa = placa;
    this.cor = cor;
    this.marca = marca;
    this.criadoEm = new Date().toISOString();
    this.atualizadoEm = new Date().toISOString();
  }

  update(data) {
    const fields = ['placa', 'cor', 'marca'];
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
      placa: this.placa,
      cor: this.cor,
      marca: this.marca,
      criadoEm: this.criadoEm,
      atualizadoEm: this.atualizadoEm,
    };
  }
}

module.exports = Automovel;
