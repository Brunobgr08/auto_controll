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

### Passo 1: Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd auto_controll
npm install
```
