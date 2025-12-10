# Sistema de Controle de Utilização de Automóveis

API RESTful para controle de utilização de automóveis, desenvolvida em Node.js com Express.js.

## Funcionalidades

### Cadastro de Automóveis

- ✅ Criar, ler, atualizar e excluir automóveis
- ✅ Listar automóveis com filtros por cor e marca
- ✅ Validação de placa (formato brasileiro)

### Cadastro de Motoristas

- ✅ Criar, ler, atualizar e excluir motoristas
- ✅ Listar motoristas com filtro por nome
- ✅ Prevenção de nomes duplicados

### Utilização de Automóveis

- ✅ Registrar início de utilização (automóvel + motorista + motivo)
- ✅ Finalizar utilização com data de término
- ✅ Listar utilizações com informações completas
- ✅ **Regras de negócio:**
  - Um automóvel só pode ser utilizado por um motorista por vez
  - Um motorista não pode utilizar outro automóvel ao mesmo tempo

## Tecnologias

- **Node.js** v16+
- **Express.js** - Framework web
- **Jest** + **Supertest** - Testes
- **Express Validator** - Validações
- **ESLint** + **Prettier** - Padronização de código

## Instalação e Execução

### Pré-requisitos

- Node.js 16+ instalado
- NPM ou Yarn
- `jq` (opcional, para testar API via script)

### Passo 1: Clonar o repositório

```bash
git clone <url-do-repositorio>
cd auto_controll
```

### Passo 2: Setup do ambiente de desenvolvimento

Execute o script de configuração que instala dependências, configura git hooks e executa os testes:

```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

Ou, se preferir fazer manualmente:

```bash
npm install
cp .env.example .env  # Se existir
```

### Passo 3: Executar o projeto

**Modo desenvolvimento** (com hot reload via nodemon):

```bash
npm run dev
```

**Modo produção**:

```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

Documentação Swagger: `http://localhost:3000/api-docs`

## Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Executar testes com cobertura

```bash
npm run test:coverage
```

### Testar API manualmente (com servidor rodando)

Com o servidor em execução, execute o script de teste manual:

```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

Este script realiza um fluxo completo: health check → criar automóvel → criar motorista → criar utilização → finalizar utilização.

## Scripts Disponíveis

| Comando                 | Descrição                                 |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Inicia o servidor em modo desenvolvimento |
| `npm start`             | Inicia o servidor em modo produção        |
| `npm test`              | Executa todos os testes                   |
| `npm run test:watch`    | Executa testes em modo watch              |
| `npm run test:coverage` | Executa testes com relatório de cobertura |
| `npm run lint`          | Verifica o código com ESLint              |
| `npm run lint:fix`      | Corrige problemas de lint automaticamente |
| `npm run format`        | Formata o código com Prettier             |

## Scripts Shell (pasta `scripts/`)

| Script          | Descrição                                      |
| --------------- | ---------------------------------------------- |
| `setup-dev.sh`  | Configura ambiente de desenvolvimento completo |
| `test-api.sh`   | Testa a API manualmente via curl               |
| `pre-commit.sh` | Hook de pre-commit (lint + testes)             |
