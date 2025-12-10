# Plano de Desenvolvimento - Sistema de Controle de Utilização de Automóveis

## Arquitetura Sugerida

- **Backend**: Node.js + Express.js
- **Persistência**: Inicialmente em memória (arrays/objetos) com migração futura para banco de dados
- **Testes**: Jest + Supertest
- **Validação**: express-validator

## Cronograma e Lista de Issues

### Fase 1: Setup do Projeto e Infraestrutura Base

#### Issue #1: Configuração inicial do projeto

- [x] Inicializar projeto Node.js
- [x] Instalar dependências básicas (Express, Jest, etc.)
- [x] Configurar estrutura de pastas
- [x] Configurar script de execução e testes
- [x] Configurar ESLint/Prettier para padronização

#### Issue #2: Configuração do servidor Express e rotas base

- [x] Criar servidor Express básico
- [x] Configurar middleware (JSON parsing, CORS, etc.)
- [x] Criar rotas de health check
- [x] Configurar tratamento de erros básico

### Fase 2: Módulo de Automóveis

#### Issue #3: Modelo e repositório de Automóveis

- [x] Definir estrutura do modelo Automóvel
- [x] Implementar repositório em memória para CRUD
- [x] Implementar filtros (cor, marca)

#### Issue #4: Controllers e rotas de Automóveis

- [x] Criar controllers para operações CRUD
- [x] Implementar validação de dados de entrada
- [x] Criar rotas RESTful para automóveis
- [x] Implementar tratamento de erros específicos

#### Issue #5: Testes unitários para Automóveis

- [x] Testar repositório de automóveis
- [x] Testar controllers de automóveis
- [x] Testar validações e casos de erro

### Fase 3: Módulo de Motoristas

#### Issue #6: Modelo e repositório de Motoristas

- [x] Definir estrutura do modelo Motorista
- [x] Implementar repositório em memória para CRUD
- [x] Implementar filtro por nome

#### Issue #7: Controllers e rotas de Motoristas

- [x] Criar controllers para operações CRUD
- [x] Implementar validação de dados de entrada
- [x] Criar rotas RESTful para motoristas

#### Issue #8: Testes unitários para Motoristas

- [x] Testar repositório de motoristas
- [x] Testar controllers de motoristas
- [x] Testar validações e casos de erro

### Fase 4: Módulo de Utilização de Automóveis

#### Issue #9: Modelo e repositório de Utilizações

- [x] Definir estrutura do modelo Utilização
- [x] Implementar repositório em memória
- [x] Implementar regras de negócio (veículo/motorista não podem estar em uso simultaneamente)

#### Issue #10: Controllers e rotas de Utilizações

- [x] Criar controllers para operações de utilização
- [x] Implementar validações e regras de negócio
- [x] Criar rotas para iniciar, finalizar e listar utilizações

#### Issue #11: Testes unitários para Utilizações

- [x] Testar regras de negócio
- [x] Testar casos de uso simultâneo
- [x] Testar controllers de utilização

### Fase 5: Integração e Validações

#### Issue #12: Validações de integridade referencial

- [x] Validar existência de motorista/automóvel ao criar utilização
- [x] Implementar verificação de dependências ao excluir registros
- [x] Tratar todos os cenários de erro possíveis

#### Issue #13: Testes de integração

- [x] Testar fluxos completos de uso
- [x] Testar cenários de erro de integração
- [x] Testar filtros combinados

### Fase 6: Documentação e Finalização

#### Issue #14: Documentação e instruções

- [ ] Criar README com instruções de execução
- [ ] Documentar endpoints da API
- [ ] Criar exemplos de uso
- [ ] Adicionar scripts auxiliares

#### Issue #15: Refatoração e otimização

- [ ] Revisar código e padrões
- [ ] Otimizar consultas e filtros
- [ ] Melhorar tratamento de erros

## Estrutura de Pastas

```
src/
├── controllers/
├── models/
├── repositories/
├── routes/
├── middlewares/
├── services/
├── validations/
tests/
├── unit/
│   ├── models/
│   ├── repositories/
├── integration/
scripts/
```
