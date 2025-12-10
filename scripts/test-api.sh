#!/bin/bash

# Script para testar a API manualmente

API_URL="http://localhost:3000/api"

echo "🔍 Testando API de Controle de Automóveis"
echo "========================================="

# Health Check
echo ""
echo "1. Health Check:"
curl -s "$API_URL/health" | jq '.'

# Criar automóvel
echo ""
echo "2. Criando automóvel:"
AUTOMOVEL_RESPONSE=$(curl -s -X POST "$API_URL/automoveis" \
  -H "Content-Type: application/json" \
  -d '{"placa":"ABC1D23","cor":"Preto","marca":"Toyota"}')
echo "$AUTOMOVEL_RESPONSE" | jq '.'
AUTOMOVEL_ID=$(echo "$AUTOMOVEL_RESPONSE" | jq -r '.id')

# Criar motorista
echo ""
echo "3. Criando motorista:"
MOTORISTA_RESPONSE=$(curl -s -X POST "$API_URL/motoristas" \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva"}')
echo "$MOTORISTA_RESPONSE" | jq '.'
MOTORISTA_ID=$(echo "$MOTORISTA_RESPONSE" | jq -r '.id')

# Criar utilização
echo ""
echo "4. Criando utilização:"
UTILIZACAO_RESPONSE=$(curl -s -X POST "$API_URL/utilizacoes" \
  -H "Content-Type: application/json" \
  -d "{\"automovelId\":\"$AUTOMOVEL_ID\",\"motoristaId\":\"$MOTORISTA_ID\",\"motivo\":\"Viagem de teste\"}")
echo "$UTILIZACAO_RESPONSE" | jq '.'
UTILIZACAO_ID=$(echo "$UTILIZACAO_RESPONSE" | jq -r '.id')

# Listar utilizações ativas
echo ""
echo "5. Listando utilizações ativas:"
curl -s "$API_URL/utilizacoes?ativa=true" | jq '.'

# Verificar se automóvel está em uso
echo ""
echo "6. Verificando se automóvel está em uso:"
curl -s "$API_URL/utilizacoes/automovel/$AUTOMOVEL_ID/em-uso" | jq '.'

# Finalizar utilização
echo ""
echo "7. Finalizando utilização:"
curl -s -X POST "$API_URL/utilizacoes/$UTILIZACAO_ID/finalizar" \
  -H "Content-Type: application/json" \
  -d '{"dataTermino":"2023-12-08T18:00:00.000Z"}' | jq '.'

# Listar todas as utilizações
echo ""
echo "8. Listando todas as utilizações:"
curl -s "$API_URL/utilizacoes" | jq '.'

echo ""
echo "✅ Teste concluído!"