#!/bin/bash

# Script de Setup do Revenue Panel

echo "🚀 Iniciando setup do Revenue Panel..."
echo ""

# Setup Backend
echo "📦 Configurando Backend Node.js..."
cd Revenue-node

# Criar arquivo .env
cp .env.example .env
echo "✅ Arquivo .env criado em Revenue-node/"
echo "⚠️  IMPORTANTE: Atualize os dados de conexão do banco de dados no .env"
echo ""

# Instalar dependências
echo "📥 Instalando dependências do backend..."
npm install
echo "✅ Dependências instaladas"
echo ""

# Setup Frontend
echo "📦 Configurando Frontend Next.js..."
cd ../Revenue-app

# Criar arquivo .env.local
cp .env.example .env.local
echo "✅ Arquivo .env.local criado em Revenue-app/"
echo "⚠️  IMPORTANTE: Atualize a URL da API no .env.local"
echo ""

# Instalar dependências
echo "📥 Instalando dependências do frontend..."
npm install
echo "✅ Dependências instaladas"
echo ""

echo "✨ Setup concluído!"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Banco de Dados:"
echo "   - Atualize a conexão do banco no: Revenue-node/.env"
echo "   - Execute os scripts SQL em: scripts/"
echo "     - 001-create-tables.sql"
echo "     - 002-seed-admin.sql"
echo ""
echo "2. Backend:"
echo "   cd Revenue-node"
echo "   npm start"
echo ""
echo "3. Frontend (novo terminal):"
echo "   cd Revenue-app"
echo "   npm run dev"
echo ""
echo "4. Acesse: http://localhost:3000"
echo "   Email: admin@bravopanel.com"
echo "   Senha: Mudar123"
echo ""
