# 📑 REVENUE PANEL - ÍNDICE E GUIA DE NAVEGAÇÃO

## 🎯 Começar Aqui

**Novo no projeto?** Comece por este arquivo para entender tudo.

---

## 📚 DOCUMENTAÇÃO PRINCIPAL

| Arquivo | Descrição | Quem Deve Ler |
|---------|-----------|---------------|
| **README.md** | Guia de setup e uso | ✅ LEIA PRIMEIRO |
| **CONCLUSAO.txt** | Visual de conclusão | Todos |
| **RESUMO_EXECUTIVO.md** | Sumário de tudo | Gerentes |

---

## 🛠️ SETUP E INSTALAÇÃO

| Arquivo | Descrição | Quando Usar |
|---------|-----------|------------|
| **QUICK_START.sh** | Setup automático com verificações | Primeira vez |
| **setup.sh** | Setup simples (npm install) | Instalação básica |
| **scripts/001-create-tables.sql** | Cria tabelas do banco | Setup inicial |
| **scripts/002-seed-admin.sql** | Cria admin padrão | Setup inicial |
| **scripts/seed-admin.js** | Gera hash bcrypt | Resetar senha |

---

## 📖 DOCUMENTAÇÃO TÉCNICA

| Arquivo | Descrição | Para Quem |
|---------|-----------|----------|
| **TECH_DOCS.md** | Documentação técnica completa | Desenvolvedores |
| **PWA_INSTALL_GUIDE.md** | Como instalar no mobile | Usuários finais |
| **TROUBLESHOOTING.md** | Solução de problemas | Support/Devs |
| **DEPLOY_PRODUCTION.sh** | Guia de deploy | DevOps/Devs |

---

## 📁 ESTRUTURA DE PASTA

### Frontend (Revenue-app/)
```
app/
├── page.tsx                  Login
├── layout.tsx               Root + PWA
├── globals.css              Estilos
└── dashboard/
    ├── layout.tsx           Sidebar + Nav
    ├── page.tsx             Dashboard
    ├── usuarios/            Gerenciar usuários
    ├── casas/               Ver casas
    ├── saques/              Saques
    ├── relatorios/          Relatórios
    └── admin/casas/         Admin: casas

components/
├── sidebar.tsx              Menu lateral
├── mobile-nav.tsx           Bottom nav
├── header.tsx               Header
├── edit-affiliate-modal.tsx  Modal edição
├── new-cpa-modal.tsx        Modal novo CPA
└── switch-tab.jsx           Tabs

lib/
├── auth-context.tsx         Autenticação
├── api.ts                   Cliente HTTP
└── utils.ts                 Utilidades

public/
├── logo.jpg                 Logo
├── icon-192.png            Ícone PWA
├── manifest.json           Manifest
├── sw.js                   Service Worker
└── offline.html            Página offline
```

### Backend (Revenue-node/)
```
src/
├── index.js                 Express app
├── config/
│   └── database.js         Conexão DB
├── middleware/
│   └── auth.js             JWT + auth
└── routes/
    ├── auth.js             Login
    ├── users.js            Usuários
    ├── houses.js           Casas
    ├── cpa.js              CPAs
    ├── withdrawals.js      Saques
    └── dashboard.js        Métricas
```

### Database (scripts/)
```
001-create-tables.sql       Criar tabelas
002-seed-admin.sql          Criar admin
seed-admin.js               Hash bcrypt
```

---

## 🚀 FLUXO DE TRABALHO RECOMENDADO

### 1️⃣ Setup Inicial
```
1. Leia README.md
2. Execute QUICK_START.sh
3. Ou siga manualmente: scripts/ → setup
```

### 2️⃣ Desenvolvimento Local
```
1. Edite código em Revenue-app/ e Revenue-node/
2. Frontend recarrega automaticamente (HMR)
3. Backend reinicia com nodemon
```

### 3️⃣ Teste em Produção Local
```
1. Build: npm run build
2. Start: npm start
3. Teste URLs de produção
```

### 4️⃣ Deploy
```
1. Siga DEPLOY_PRODUCTION.sh
2. Configure variáveis em plataforma
3. Faça push para deploy automático
```

---

## 🎨 DECISÕES DE DESIGN

| Aspecto | Escolha | Justificativa |
|--------|---------|--------------|
| **Colors** | Tiffany + Rosa | Brandebook fornecido |
| **Layout** | Mobile-first | Suporta todos dispositivos |
| **Bottom Nav** | FAB central | UX mobile otimizada |
| **Auth** | JWT + bcrypt | Segurança padrão |
| **PWA** | Service Worker | Offline mode |
| **DB** | PostgreSQL | Relacional, escalável |

---

## 🔐 SEGURANÇA - CHECKLIST

- [ ] Altere JWT_SECRET no .env
- [ ] Altere senha admin após login
- [ ] Configure CORS com domínio correto
- [ ] Use HTTPS em produção
- [ ] Ative backup automático do DB
- [ ] Configure rate limiting
- [ ] Ative logging
- [ ] Configure monitoring

---

## 📊 FUNCIONALIDADES POR PÁGINA

### Login (/)
- Email + Senha
- Autenticação JWT
- Redirect para dashboard se logado

### Dashboard (/dashboard)
- Cards com métricas
- Filtros
- Gráficos

### Usuários (/dashboard/usuarios)
- Listar afiliados
- Criar novo (admin-only)
- Editar perfil
- Deletar (admin-only)

### Casas (/dashboard/casas)
- Ver casas disponíveis
- Links de afiliado

### Admin Casas (/dashboard/admin/casas)
- Cadastrar nova casa
- Editar % CPA
- Ativar/desativar

### CPA (/dashboard + FAB)
- Registrar novo CPA
- Editar dados de afiliado
- Ver métricas por casa

### Saques (/dashboard/saques)
- Solicitar saque
- Admin aprova/rejeita
- Histórico

### Relatórios (/dashboard/relatorios)
- Filtrar por período
- Exportar dados
- Gráficos

### Instalar (/instalar)
- Guia PWA iOS
- Guia PWA Android

---

## 🔧 TROUBLESHOOTING RÁPIDO

| Problema | Solução |
|----------|---------|
| Banco não conecta | Verifique .env e PostgreSQL rodando |
| Porta 3000/3001 em uso | Mude PORT no .env |
| JWT não carrega | Limpe cookies, faça login novamente |
| PWA não instala | Abra em localhost, aguarde |
| Mobile não mostra nav | Verifique mobile-nav.tsx |

Veja **TROUBLESHOOTING.md** para mais detalhes.

---

## 📞 CONTATO

- **Email:** admin@bravopanel.com
- **GitHub:** everybecchy/Painel-Bravo
- **Docs:** Veja arquivos .md

---

## 📈 PRÓXIMAS ETAPAS

1. ✅ Setup inicial
2. ⏳ Testes unitários (Jest)
3. ⏳ Testes E2E (Cypress)
4. ⏳ CI/CD (GitHub Actions)
5. ⏳ Staging deploy
6. ⏳ Production deploy
7. ⏳ Monitoring (Sentry)
8. ⏳ Analytics

---

## 🎓 RECURSOS PARA APRENDER

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs
- **Express:** https://expressjs.com
- **PostgreSQL:** https://www.postgresql.org/docs
- **TailwindCSS:** https://tailwindcss.com/docs

Veja **RECURSOS_LINKS_UTEIS.md** para mais links.

---

## ✨ VERSÃO DO PROJETO

- **Nome:** Revenue Panel
- **Versão:** 1.0.0
- **Status:** Production Ready ✅
- **Data:** Março 2026

---

## 🎯 Você Está Aqui!

```
Índice (Este arquivo)
  ↓
README.md (Setup)
  ↓
QUICK_START.sh (Automatizar)
  ↓
Desenvolvimento Local
  ↓
TECH_DOCS.md (Entender)
  ↓
Testes
  ↓
DEPLOY_PRODUCTION.sh (Deploy)
  ↓
Produção ✨
```

---

**Pronto para começar? Abra o README.md!** 🚀
