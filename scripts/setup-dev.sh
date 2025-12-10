#!/bin/bash

# Script de setup para desenvolvimento

echo "⚙️  Configurando ambiente de desenvolvimento..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar git hooks (opcional)
echo "🔗 Configurando git hooks..."
if [ -f .git/hooks/pre-commit ]; then
  rm .git/hooks/pre-commit
fi
ln -s ../../scripts/pre-commit.sh .git/hooks/pre-commit

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
  echo "📄 Criando arquivo .env..."
  cp .env.example .env
  echo "⚠️  Edite o arquivo .env com suas configurações"
fi

# Verificar estrutura
echo "🔍 Verificando estrutura de diretórios..."
required_dirs=("src" "tests" "scripts")
for dir in "${required_dirs[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ Diretório $dir não encontrado"
    exit 1
  fi
done

# Executar lint
echo "🧹 Executando lint..."
npm run lint

# Executar testes
echo "🧪 Executando testes..."
npm test

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "Comandos disponíveis:"
echo "  npm run dev    - Iniciar servidor de desenvolvimento"
echo "  npm test       - Executar testes"
echo "  npm run lint   - Verificar código"
echo ""
echo "A API estará disponível em: http://localhost:3000"