#!/bin/bash

# Script para configurar o Prisma e criar as tabelas no banco de dados
# Execute este script na pasta Revenue-node

echo "=================================="
echo "   SETUP PRISMA - Revenue Panel   "
echo "=================================="
echo ""

# Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
    echo "Erro: Execute este script na pasta Revenue-node"
    echo "cd Revenue-node && bash ../scripts/setup-prisma.sh"
    exit 1
fi

# Verificar se o .env existe
if [ ! -f ".env" ]; then
    echo "Erro: Arquivo .env nao encontrado!"
    echo "Copie o .env.example e configure a DATABASE_URL"
    echo ""
    echo "cp .env.example .env"
    echo "nano .env"
    exit 1
fi

# Verificar se DATABASE_URL esta configurada
if ! grep -q "DATABASE_URL" .env; then
    echo "Erro: DATABASE_URL nao encontrada no .env"
    exit 1
fi

echo "1. Instalando dependencias..."
npm install

echo ""
echo "2. Gerando cliente Prisma..."
npx prisma generate

echo ""
echo "3. Criando/atualizando tabelas no banco..."
npx prisma db push

echo ""
echo "4. Executando seed (criando admin e casas)..."
npm run db:seed

echo ""
echo "=================================="
echo "   SETUP CONCLUIDO COM SUCESSO!   "
echo "=================================="
echo ""
echo "Credenciais do admin:"
echo "  Email: admin@bravopanel.com"
echo "  Senha: Mudar123"
echo ""
echo "Para iniciar o servidor:"
echo "  npm run dev"
echo ""
