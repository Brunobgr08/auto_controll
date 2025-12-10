module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  VALIDATION: {
    PLACA_REGEX: /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i,
    NOME_REGEX: /^[a-zA-ZÀ-ÿ\s']+$/,
    ID_REGEX: /^\d+$/,
  },

  LIMITS: {
    NOME_MIN: 3,
    NOME_MAX: 100,
    MOTIVO_MIN: 5,
    MOTIVO_MAX: 500,
    COR_MIN: 3,
    COR_MAX: 50,
    MARCA_MIN: 2,
    MARCA_MAX: 50,
  },

  MESSAGES: {
    NOT_FOUND: {
      AUTOMOVEL: 'Automóvel não encontrado',
      MOTORISTA: 'Motorista não encontrado',
      UTILIZACAO: 'Utilização não encontrada',
    },
    CONFLICT: {
      AUTOMOVEL_EM_USO: 'Automóvel já está em uso',
      MOTORISTA_EM_USO: 'Motorista já está utilizando outro automóvel',
      PLACA_DUPLICADA: 'Já existe um automóvel com esta placa',
      NOME_DUPLICADO: 'Já existe um motorista com este nome',
      AUTOMOVEL_COM_HISTORICO:
        'Não é possível excluir automóvel com histórico de utilizações. Considere desativar em vez de excluir.',
      MOTORISTA_COM_HISTORICO:
        'Não é possível excluir motorista com histórico de utilizações. Considere desativar em vez de excluir.',
      UTILIZACAO_ATIVA:
        'Não é possível excluir uma utilização ativa. Finalize-a primeiro.',
      UTILIZACAO_FINALIZADA: 'Utilização já foi finalizada',
    },
  },
};
