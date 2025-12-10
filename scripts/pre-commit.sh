#!/bin/bash

# Git pre-commit hook

# Carregar PATH do usuário (caso necessário)
export PATH="$HOME/.local/bin:$PATH"
export PATH="/usr/local/bin:$PATH"

# Tentar carregar fnm (Fast Node Manager) se disponível
if command -v fnm &> /dev/null || [ -d "$HOME/.local/share/fnm" ]; then
  export PATH="$HOME/.local/share/fnm:$PATH"
  eval "$(fnm env --shell bash 2>/dev/null)" 2>/dev/null
fi

# Tentar carregar nvm se disponível
if [ -f "$HOME/.nvm/nvm.sh" ]; then
  source "$HOME/.nvm/nvm.sh"
fi

# Fallback: procurar node em locais comuns do fnm
if ! command -v npm &> /dev/null; then
  for dir in /run/user/*/fnm_multishells/*/bin; do
    if [ -x "$dir/npm" ]; then
      export PATH="$dir:$PATH"
      break
    fi
  done
fi

echo "🔍 Executando verificações pre-commit..."

# Verificar se npm está disponível
if ! command -v npm &> /dev/null; then
  echo "❌ npm não encontrado no PATH."
  echo "PATH atual: $PATH"
  exit 1
fi

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