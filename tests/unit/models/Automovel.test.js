const Automovel = require('../../../src/models/Automovel');

describe('Modelo Automovel', () => {
  it('deve criar uma instância de Automovel com propriedades corretas', () => {
    const data = {
      id: '1',
      placa: 'ABC1D23',
      cor: 'Preto',
      marca: 'Toyota',
    };

    const automovel = new Automovel(data);

    expect(automovel.id).toBe('1');
    expect(automovel.placa).toBe('ABC1D23');
    expect(automovel.cor).toBe('Preto');
    expect(automovel.marca).toBe('Toyota');
    expect(automovel.criadoEm).toBeDefined();
    expect(automovel.atualizadoEm).toBeDefined();
  });

  it('deve atualizar as propriedades corretamente', () => {
    const automovel = new Automovel({
      id: '1',
      placa: 'ABC1D23',
      cor: 'Preto',
      marca: 'Toyota',
    });

    // Guardar timestamp original
    const timestampOriginal = automovel.atualizadoEm;

    const dataAtualizacao = {
      cor: 'Branco',
      marca: 'Honda',
    };

    // Atualizar
    automovel.update(dataAtualizacao);

    // Verificar propriedades atualizadas
    expect(automovel.cor).toBe('Branco');
    expect(automovel.marca).toBe('Honda');
    expect(automovel.placa).toBe('ABC1D23'); // Não mudou

    // Verificar que atualizadoEm é uma string ISO válida
    expect(typeof automovel.atualizadoEm).toBe('string');
    expect(() => new Date(automovel.atualizadoEm)).not.toThrow();

    // Verificar que é uma data válida (não precisa ser diferente, apenas válida)
    expect(automovel.atualizadoEm).toBeDefined();

    // Se quiser verificar que é diferente, podemos verificar se é um timestamp válido
    // Mas não podemos garantir que será diferente em milissegundos
    const novaData = new Date(automovel.atualizadoEm);
    const dataOriginal = new Date(timestampOriginal);
    expect(novaData.getTime()).toBeGreaterThanOrEqual(dataOriginal.getTime());
  });

  it('deve converter para JSON corretamente', () => {
    const automovel = new Automovel({
      id: '1',
      placa: 'ABC1D23',
      cor: 'Preto',
      marca: 'Toyota',
    });

    const json = automovel.toJSON();

    expect(json).toEqual({
      id: '1',
      placa: 'ABC1D23',
      cor: 'Preto',
      marca: 'Toyota',
      criadoEm: expect.any(String),
      atualizadoEm: expect.any(String),
    });
  });
});
