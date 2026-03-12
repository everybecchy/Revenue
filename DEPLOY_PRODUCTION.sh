#!/bin/bash

# 🚀 Revenue Panel - Deploy Production Guide

cat << "EOF"

╔════════════════════════════════════════════════════════════════╗
║         REVENUE PANEL - GUIA DE DEPLOY EM PRODUÇÃO            ║
╚════════════════════════════════════════════════════════════════╝

EOF

echo ""
echo "🌍 CHECKLIST PRÉ-DEPLOY"
echo "========================"
echo ""
echo "[ ] 1. Alterar senha do admin"
echo "[ ] 2. Gerar JWT_SECRET seguro (mínimo 32 caracteres)"
echo "[ ] 3. Configurar CORS com domínio correto"
echo "[ ] 4. Ativar HTTPS em produção"
echo "[ ] 5. Backup do banco de dados"
echo "[ ] 6. Testar todas as rotas da API"
echo "[ ] 7. Verificar limites de rate limiting"
echo "[ ] 8. Configurar logs e monitoring"
echo "[ ] 9. Testar PWA em dispositivos reais"
echo "[ ] 10. Configurar CI/CD se necessário"
echo ""

echo "📦 DEPLOY - OPÇÃO 1: VERCEL (Frontend)"
echo "======================================="
echo ""
echo "1. Instale CLI Vercel:"
echo "   npm install -g vercel"
echo ""
echo "2. Deploy:"
echo "   cd Revenue-app"
echo "   vercel --prod"
echo ""
echo "3. Configure variáveis no painel:"
echo "   NEXT_PUBLIC_API_URL=https://seu-backend.com"
echo ""

echo ""
echo "📦 DEPLOY - OPÇÃO 2: HEROKU (Backend)"
echo "======================================"
echo ""
echo "1. Instale CLI Heroku:"
echo "   npm install -g heroku"
echo ""
echo "2. Faça login:"
echo "   heroku login"
echo ""
echo "3. Crie app:"
echo "   cd Revenue-node"
echo "   heroku create seu-app-name"
echo ""
echo "4. Configure variáveis:"
echo "   heroku config:set DB_HOST=seu_host"
echo "   heroku config:set DB_PORT=5432"
echo "   heroku config:set DB_NAME=revenue_db"
echo "   heroku config:set DB_USER=seu_user"
echo "   heroku config:set DB_PASSWORD=sua_senha"
echo "   heroku config:set JWT_SECRET=seu_jwt_secreto"
echo "   heroku config:set FRONTEND_URL=https://seu-frontend.com"
echo ""
echo "5. Deploy:"
echo "   git push heroku main"
echo ""

echo ""
echo "📦 DEPLOY - OPÇÃO 3: RAILWAY/RENDER (Backend)"
echo "=============================================="
echo ""
echo "1. Conecte seu GitHub a Railway/Render"
echo ""
echo "2. Configure variáveis de ambiente no painel:"
echo "   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD"
echo "   JWT_SECRET, FRONTEND_URL, PORT, NODE_ENV"
echo ""
echo "3. Faz deploy automático no git push"
echo ""

echo ""
echo "🗄️  PREPARAR BANCO EM PRODUÇÃO"
echo "==============================="
echo ""
echo "1. Criar banco PostgreSQL:"
echo "   createdb revenue_db_prod"
echo ""
echo "2. Executar migrations:"
echo "   psql -h seu_host -U seu_user -d revenue_db_prod -f scripts/001-create-tables.sql"
echo "   psql -h seu_host -U seu_user -d revenue_db_prod -f scripts/002-seed-admin.sql"
echo ""
echo "3. Verificar:"
echo "   psql -h seu_host -U seu_user -d revenue_db_prod"
echo "   \\dt  (listar tabelas)"
echo "   SELECT COUNT(*) FROM users;  (verificar dados)"
echo ""

echo ""
echo "🔐 SEGURANÇA EM PRODUÇÃO"
echo "========================"
echo ""
echo "1. Gerar novo JWT_SECRET:"
echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo ""
echo "2. Alterar senha admin:"
echo "   ssh seu_servidor"
echo "   cd Revenue-node"
echo "   npm install bcryptjs"
echo "   node -e \""
echo "   const bcrypt = require('bcryptjs');"
echo "   console.log(bcrypt.hashSync('nova_senha', 10));"
echo "   \""
echo ""
echo "3. Atualizar no banco:"
echo "   UPDATE users SET password_hash = 'NOVO_HASH' WHERE email = 'admin@bravopanel.com';"
echo ""

echo ""
echo "📊 MONITORAMENTO"
echo "================="
echo ""
echo "1. Health Check Backend:"
echo "   curl https://seu-backend.com/health"
echo ""
echo "2. Logs em tempo real (Heroku):"
echo "   heroku logs --tail -a seu-app-name"
echo ""
echo "3. Monitoring (recomendado):"
echo "   - Sentry (error tracking)"
echo "   - LogRocket (user session replay)"
echo "   - New Relic (performance monitoring)"
echo "   - Datadog (infrastructure)"
echo ""

echo ""
echo "🔄 CI/CD (GitHub Actions)"
echo "=========================="
echo ""
echo "Crie .github/workflows/deploy.yml:"
echo ""
cat > /tmp/github_actions_example.yml << 'GITHUB'
name: Deploy to Vercel and Heroku

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy Frontend to Vercel
      run: |
        cd Revenue-app
        npm install -g vercel
        vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
    
    - name: Deploy Backend to Heroku
      run: |
        cd Revenue-node
        git push https://heroku:${{ secrets.HEROKU_API_KEY }}@git.heroku.com/${{ secrets.HEROKU_APP_NAME }}.git main
GITHUB

cat /tmp/github_actions_example.yml
echo ""

echo ""
echo "📈 PERFORMANCE"
echo "==============="
echo ""
echo "1. Build otimizado:"
echo "   npm run build"
echo ""
echo "2. Compressão:"
echo "   # No next.config.js:"
echo "   compress: true"
echo ""
echo "3. Cache:"
echo "   # No next.config.js:"
echo "   onDemandEntries: { maxInactiveAge: 60 * 1000 }"
echo ""

echo ""
echo "🚨 BACKUP E RECUPERAÇÃO"
echo "======================="
echo ""
echo "1. Backup diário (Heroku):"
echo "   heroku pg:backups:schedule DATABASE --at '04:00 America/Sao_Paulo'"
echo ""
echo "2. Backup manual:"
echo "   pg_dump -h seu_host -U seu_user revenue_db_prod > backup_\$(date +%Y%m%d).sql"
echo ""
echo "3. Restaurar:"
echo "   psql -h seu_host -U seu_user revenue_db_prod < backup.sql"
echo ""

echo ""
echo "📞 SUPORTE PÓS-DEPLOY"
echo "===================="
echo ""
echo "Email: admin@bravopanel.com"
echo ""
echo "Documentação:"
echo "  - README.md"
echo "  - TECH_DOCS.md"
echo "  - TROUBLESHOOTING.md"
echo ""

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✨ Pronto para produção! Sucesso no deploy!"
echo "════════════════════════════════════════════════════════════════"
echo ""
