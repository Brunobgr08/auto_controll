# Exemplos de Uso da API - Controle de Automóveis

Este documento apresenta exemplos práticos de uso da API de Controle de Automóveis.

## URL Base

```text
http://localhost:3000/api
```

---

## Automóveis

### Criar um automóvel

```bash
curl -X POST http://localhost:3000/api/automoveis \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "ABC1D23",
    "cor": "Preto",
    "marca": "Toyota"
  }'
```

**Resposta (201):**

```json
{
  "id": "1",
  "placa": "ABC1D23",
  "cor": "Preto",
  "marca": "Toyota",
  "criadoEm": "2025-12-10T10:00:00.000Z",
  "atualizadoEm": "2025-12-10T10:00:00.000Z"
}
```

### Listar automóveis

```bash
curl http://localhost:3000/api/automoveis
```

### Filtrar por cor e marca

```bash
curl "http://localhost:3000/api/automoveis?cor=Preto&marca=Toyota"
```

### Buscar automóvel por ID

```bash
curl http://localhost:3000/api/automoveis/1
```

### Atualizar automóvel

```bash
curl -X PUT http://localhost:3000/api/automoveis/1 \
  -H "Content-Type: application/json" \
  -d '{
    "cor": "Branco"
  }'
```

### Excluir automóvel

```bash
curl -X DELETE http://localhost:3000/api/automoveis/1
```

---

## Motoristas

### Criar um motorista

```bash
curl -X POST http://localhost:3000/api/motoristas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva"
  }'
```

**Resposta (201):**

```json
{
  "id": "1",
  "nome": "João Silva",
  "criadoEm": "2025-12-10T10:00:00.000Z",
  "atualizadoEm": "2025-12-10T10:00:00.000Z"
}
```

### Listar motoristas

```bash
curl http://localhost:3000/api/motoristas
```

### Filtrar por nome

```bash
curl "http://localhost:3000/api/motoristas?nome=João"
```

### Buscar motorista por ID

```bash
curl http://localhost:3000/api/motoristas/1
```

### Atualizar motorista

```bash
curl -X PUT http://localhost:3000/api/motoristas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Santos Silva"
  }'
```

### Excluir motorista

```bash
curl -X DELETE http://localhost:3000/api/motoristas/1
```

---

## Utilizações

### Registrar uma utilização

```bash
curl -X POST http://localhost:3000/api/utilizacoes \
  -H "Content-Type: application/json" \
  -d '{
    "automovelId": "1",
    "motoristaId": "1",
    "motivo": "Viagem a negócios"
  }'
```

**Resposta (201):**

```json
{
  "id": "1",
  "automovelId": "1",
  "motoristaId": "1",
  "dataInicio": "2025-12-10T10:00:00.000Z",
  "motivo": "Viagem a negócios",
  "dataTermino": null,
  "criadoEm": "2025-12-10T10:00:00.000Z",
  "atualizadoEm": "2025-12-10T10:00:00.000Z"
}
```

### Listar utilizações

```bash
curl http://localhost:3000/api/utilizacoes
```

### Filtrar utilizações ativas

```bash
curl "http://localhost:3000/api/utilizacoes?ativa=true"
```

### Filtrar utilizações finalizadas

```bash
curl "http://localhost:3000/api/utilizacoes?ativa=false"
```

### Finalizar utilização

```bash
curl -X POST http://localhost:3000/api/utilizacoes/1/finalizar \
  -H "Content-Type: application/json" \
  -d '{
    "dataTermino": "2025-12-10T18:00:00.000Z"
  }'
```

### Verificar se automóvel está em uso

```bash
curl http://localhost:3000/api/utilizacoes/automovel/1/em-uso
```

### Verificar se motorista está em uso

```bash
curl http://localhost:3000/api/utilizacoes/motorista/1/em-uso
```

---

## Regras de Negócio

1. **Automóvel em uso**: Um automóvel só pode estar em uma utilização ativa por vez
2. **Motorista em uso**: Um motorista só pode utilizar um automóvel por vez
3. **Finalização única**: Uma utilização já finalizada não pode ser finalizada novamente

### Exemplo de erro - Automóvel já em uso

```bash
# Tentar criar utilização com automóvel já em uso
curl -X POST http://localhost:3000/api/utilizacoes \
  -H "Content-Type: application/json" \
  -d '{
    "automovelId": "1",
    "motoristaId": "2",
    "motivo": "Outra viagem"
  }'
```

**Resposta (409):**

```json
{
  "message": "Automóvel já está em uso"
}
```
