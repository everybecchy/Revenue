#!/bin/bash
# 🚀 REVENUE PANEL - QUICK START EM PORTUGUÊS

clear

cat << "EOF"

╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                  🎯 REVENUE PANEL - QUICK START                           ║
║              Painel de Gerenciamento de Afiliados e CPA                   ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

EOF

echo ""
echo "📋 PRÉ-REQUISITOS INSTALADOS?"
echo ""

# Verificar Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js NÃO INSTALADO"
    echo "   Baixe em: https://nodejs.org/en/download"
    exit 1
fi

# Verificar PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL: $(psql --version)"
else
    echo "❌ PostgreSQL NÃO INSTALADO"
    echo "   Baixe em: https://www.postgresql.org/download"
    exit 1
fi

echo ""
echo "═════════════════════════════════════════════════════════════════════════"
echo ""
echo "✨ COMEÇAR O SETUP? (y/n)"
read -r response

if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo "Setup cancelado."
    exit 0
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "1️⃣  CRIANDO BANCO DE DADOS..."
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# Criar banco
createdb revenue_db 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Banco de dados criado: revenue_db"
else
    echo "⚠️  Banco de dados já existe"
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "2️⃣  EXECUTANDO SCRIPTS SQL..."
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# Executar scripts SQL
psql -U postgres -d revenue_db -f scripts/001-create-tables.sql 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Tabelas criadas com sucesso"
else
    echo "❌ Erro ao criar tabelas"
    exit 1
fi

echo ""
psql -U postgres -d revenue_db -f scripts/002-seed-admin.sql 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Admin criado com sucesso"
else
    echo "❌ Erro ao criar admin (tente criar manualmente)"
fi

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "3️⃣  CONFIGURANDO BACKEND..."
echo "════════════════════════════════════════════════════════════════════════"
echo ""

cd Revenue-node

# Copiar .env
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Arquivo .env criado"
    echo ""
    echo "⚠️  EDITE O ARQUIVO: Revenue-node/.env"
    echo "   - DB_PASSWORD: sua senha PostgreSQL"
    echo "   - JWT_SECRET: gerar algo seguro (min 32 chars)"
    echo ""
fi

# Instalar dependências
echo "📥 Instalando dependências do backend..."
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

cd ..

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "4️⃣  CONFIGURANDO FRONTEND..."
echo "════════════════════════════════════════════════════════════════════════"
echo ""

cd Revenue-app

# Copiar .env.local
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Arquivo .env.local criado"
fi

# Instalar dependências
echo "📥 Instalando dependências do frontend..."
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

cd ..

echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo "✅ SETUP CONCLUÍDO!"
echo "════════════════════════════════════════════════════════════════════════"
echo ""

echo "🔑 CREDENCIAIS DE ACESSO:"
echo "   Email: admin@bravopanel.com"
echo "   Senha: Mudar123"
echo ""

echo "🚀 PARA INICIAR OS SERVIDORES:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   $ cd Revenue-node"
echo "   $ npm start"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd Revenue-app"
echo "   $ npm run dev"
echo ""

echo "🌐 ACESSE:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""

echo "📚 DOCUMENTAÇÃO:"
echo "   README.md              → Leia primeiro!"
echo "   TECH_DOCS.md           → Documentação técnica"
echo "   PWA_INSTALL_GUIDE.md   → Como instalar no celular"
echo "   TROUBLESHOOTING.md     → Se tiver problemas"
echo ""

echo "════════════════════════════════════════════════════════════════════════"
echo "✨ Pronto para começar! Boa sorte!"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
