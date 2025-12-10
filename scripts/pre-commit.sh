#!/bin/bash

# Git pre-commit hook

echo "🔍 Executando verificações pre-commit..."

# Executar lint
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Lint falhou. Corrija os erros antes de commitar."
  exit 1
fi

# Executar testes
npm test
if [ $? -ne 0 ]; then
  echo "❌ Testes falharam. Corrija antes de commitar."
  exit 1
fi

# Formatar código
npm run format
git add .

echo "✅ Verificações passaram. Pode commitar!"