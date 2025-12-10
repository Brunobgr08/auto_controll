const Motorista = require('../../../src/models/Motorista');

describe('Modelo Motorista', () => {
  it('deve criar uma instância de Motorista com propriedades corretas', () => {
    const data = {
      id: '1',
      nome: 'João Silva',
    };

    const motorista = new Motorista(data);

    expect(motorista.id).toBe('1');
    expect(motorista.nome).toBe('João Silva');
    expect(motorista.criadoEm).toBeDefined();
    expect(motorista.atualizadoEm).toBeDefined();
  });

  it('deve atualizar as propriedades corretamente', () => {
    const motorista = new Motorista({
      id: '1',
      nome: 'João Silva',
    });

    const dataAtualizacao = {
      nome: 'Maria Santos',
    };

    motorista.update(dataAtualizacao);

    expect(motorista.nome).toBe('Maria Santos');

    // Verificar que atualizadoEm é uma string ISO válida
    expect(typeof motorista.atualizadoEm).toBe('string');
    expect(() => new Date(motorista.atualizadoEm)).not.toThrow();
  });

  it('deve converter para JSON corretamente', () => {
    const motorista = new Motorista({
      id: '1',
      nome: 'João Silva',
    });

    const json = motorista.toJSON();

    expect(json).toEqual({
      id: '1',
      nome: 'João Silva',
      criadoEm: expect.any(String),
      atualizadoEm: expect.any(String),
    });
  });

  it('não deve alterar propriedades não especificadas na atualização', () => {
    const motorista = new Motorista({
      id: '1',
      nome: 'João Silva',
    });

    const dataAtualizacao = {};

    motorista.update(dataAtualizacao);

    expect(motorista.nome).toBe('João Silva');
    expect(motorista.id).toBe('1');
  });
});
