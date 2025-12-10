const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Controle de Automóveis',
      version: '1.0.0',
      description: 'Sistema de controle de utilização de automóveis',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      schemas: {
        Automovel: {
          type: 'object',
          required: ['placa', 'cor', 'marca'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do automóvel',
            },
            placa: {
              type: 'string',
              description: 'Placa do automóvel',
              example: 'ABC1D23',
            },
            cor: {
              type: 'string',
              description: 'Cor do automóvel',
              example: 'Preto',
            },
            marca: {
              type: 'string',
              description: 'Marca do automóvel',
              example: 'Toyota',
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            atualizadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Motorista: {
          type: 'object',
          required: ['nome'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do motorista',
            },
            nome: {
              type: 'string',
              description: 'Nome do motorista',
              example: 'João Silva',
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            atualizadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Utilizacao: {
          type: 'object',
          required: ['automovelId', 'motoristaId', 'motivo'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da utilização',
            },
            automovelId: {
              type: 'integer',
              description: 'ID do automóvel utilizado',
            },
            motoristaId: {
              type: 'integer',
              description: 'ID do motorista responsável',
            },
            dataInicio: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de início da utilização',
            },
            motivo: {
              type: 'string',
              description: 'Motivo da utilização',
              example: 'Viagem de trabalho',
            },
            dataTermino: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora de término da utilização',
              nullable: true,
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            atualizadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
            ativa: {
              type: 'boolean',
              description: 'Indica se a utilização está ativa',
            },
          },
        },
        UtilizacaoCompleta: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da utilização',
            },
            automovel: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                placa: { type: 'string' },
                cor: { type: 'string' },
                marca: { type: 'string' },
              },
            },
            motorista: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                nome: { type: 'string' },
              },
            },
            dataInicio: {
              type: 'string',
              format: 'date-time',
            },
            motivo: {
              type: 'string',
            },
            dataTermino: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
            },
            atualizadoEm: {
              type: 'string',
              format: 'date-time',
            },
            ativa: {
              type: 'boolean',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
            message: {
              type: 'string',
              description: 'Detalhes do erro',
            },
          },
        },
        Health: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            message: {
              type: 'string',
              example: 'API está funcionando corretamente',
            },
            version: {
              type: 'string',
              example: '1.0.0',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      parameters: {
        AutomovelId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID do automóvel',
        },
        MotoristaId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID do motorista',
        },
        UtilizacaoId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID da utilização',
        },
        AutomovelIdQuery: {
          name: 'automovelId',
          in: 'query',
          schema: {
            type: 'integer',
          },
          description: 'Filtrar por ID do automóvel',
        },
        MotoristaIdQuery: {
          name: 'motoristaId',
          in: 'query',
          schema: {
            type: 'integer',
          },
          description: 'Filtrar por ID do motorista',
        },
        Ativa: {
          name: 'ativa',
          in: 'query',
          schema: {
            type: 'boolean',
          },
          description: 'Filtrar por status ativo',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Caminhos para os arquivos que contêm as anotações
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
