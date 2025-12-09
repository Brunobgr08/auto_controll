const Utilizacao = require('../../../src/models/Utilizacao');

describe('Modelo Utilizacao', () => {
  it('deve criar uma instância de Utilizacao com propriedades corretas', () => {
    const data = {
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      dataInicio: '2023-12-08T10:00:00.000Z',
      motivo: 'Viagem a negócios',
    };

    const utilizacao = new Utilizacao(data);

    expect(utilizacao.id).toBe('1');
    expect(utilizacao.automovelId).toBe('1');
    expect(utilizacao.motoristaId).toBe('1');
    expect(utilizacao.dataInicio).toBe('2023-12-08T10:00:00.000Z');
    expect(utilizacao.motivo).toBe('Viagem a negócios');
    expect(utilizacao.dataTermino).toBeNull();
    expect(utilizacao.criadoEm).toBeDefined();
    expect(utilizacao.atualizadoEm).toBeDefined();
  });

  it('deve criar utilização com data de término se fornecida', () => {
    const data = {
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      dataInicio: '2023-12-08T10:00:00.000Z',
      motivo: 'Viagem a negócios',
      dataTermino: '2023-12-08T18:00:00.000Z',
    };

    const utilizacao = new Utilizacao(data);

    expect(utilizacao.dataTermino).toBe('2023-12-08T18:00:00.000Z');
  });

  it('deve usar data atual se dataInicio não for fornecida', () => {
    const data = {
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      motivo: 'Viagem a negócios',
    };

    const utilizacao = new Utilizacao(data);

    expect(utilizacao.dataInicio).toBeDefined();
    expect(() => new Date(utilizacao.dataInicio)).not.toThrow();
  });

  it('deve finalizar a utilização', () => {
    const utilizacao = new Utilizacao({
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      motivo: 'Viagem a negócios',
    });

    expect(utilizacao.estaAtiva()).toBe(true);

    const dataTermino = '2023-12-08T18:00:00.000Z';
    utilizacao.finalizar(dataTermino);

    expect(utilizacao.dataTermino).toBe(dataTermino);
    expect(utilizacao.estaAtiva()).toBe(false);
    expect(utilizacao.atualizadoEm).toBeDefined();
  });

  it('deve usar data atual ao finalizar se dataTermino não for fornecida', () => {
    const utilizacao = new Utilizacao({
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      motivo: 'Viagem a negócios',
    });

    utilizacao.finalizar();

    expect(utilizacao.dataTermino).toBeDefined();
    expect(() => new Date(utilizacao.dataTermino)).not.toThrow();
    expect(utilizacao.estaAtiva()).toBe(false);
  });

  it('deve converter para JSON corretamente', () => {
    const utilizacao = new Utilizacao({
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      dataInicio: '2023-12-08T10:00:00.000Z',
      motivo: 'Viagem a negócios',
      dataTermino: '2023-12-08T18:00:00.000Z',
    });

    const json = utilizacao.toJSON();

    expect(json).toEqual({
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      dataInicio: '2023-12-08T10:00:00.000Z',
      motivo: 'Viagem a negócios',
      dataTermino: '2023-12-08T18:00:00.000Z',
      criadoEm: expect.any(String),
      atualizadoEm: expect.any(String),
    });
  });

  it('deve converter para JSON completo corretamente', () => {
    const utilizacao = new Utilizacao({
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      dataInicio: '2023-12-08T10:00:00.000Z',
      motivo: 'Viagem a negócios',
    });

    const automovel = {
      id: '1',
      placa: 'ABC1D23',
      cor: 'Preto',
      marca: 'Toyota',
    };

    const motorista = {
      id: '1',
      nome: 'João Silva',
    };

    const json = utilizacao.toJSONCompleto(automovel, motorista);

    expect(json).toEqual({
      id: '1',
      automovel: {
        id: '1',
        placa: 'ABC1D23',
        cor: 'Preto',
        marca: 'Toyota',
      },
      motorista: {
        id: '1',
        nome: 'João Silva',
      },
      dataInicio: '2023-12-08T10:00:00.000Z',
      motivo: 'Viagem a negócios',
      dataTermino: null,
      criadoEm: expect.any(String),
      atualizadoEm: expect.any(String),
      ativa: true,
    });
  });

  it('deve lidar com automóvel ou motorista ausentes no JSON completo', () => {
    const utilizacao = new Utilizacao({
      id: '1',
      automovelId: '1',
      motoristaId: '1',
      motivo: 'Viagem a negócios',
    });

    const json = utilizacao.toJSONCompleto(null, null);

    expect(json.automovel).toEqual({ id: '1' });
    expect(json.motorista).toEqual({ id: '1' });
  });
});
