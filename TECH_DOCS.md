# 📊 Revenue Panel - Documentação Técnica

## 🏗️ Estrutura do Projeto

```
Revenue/
├── scripts/                          # Scripts SQL para banco de dados
│   ├── 001-create-tables.sql        # Criação das tabelas
│   ├── 002-seed-admin.sql           # Seed do usuário admin
│   └── seed-admin.js                # Script Node.js para gerar hash
│
├── Revenue-app/                     # Frontend Next.js
│   ├── app/
│   │   ├── page.tsx                 # Login
│   │   ├── layout.tsx               # Layout root com PWA
│   │   ├── dashboard/
│   │   │   ├── layout.tsx           # Dashboard layout
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   ├── usuarios/            # CRUD de usuários
│   │   │   ├── casas/               # Casas de apostas
│   │   │   ├── saques/              # Gerenciar saques
│   │   │   ├── relatorios/          # Relatórios
│   │   │   └── admin/
│   │   │       └── casas/           # Admin: Cadastrar casas
│   │   ├── instalar/                # Guia PWA
│   │   └── globals.css              # Estilos globais
│   ├── components/
│   │   ├── sidebar.tsx              # Menu lateral
│   │   ├── mobile-nav.tsx           # Nav mobile com FAB
│   │   ├── header.tsx               # Header com logout
│   │   ├── edit-affiliate-modal.tsx # Modal de edição
│   │   ├── new-cpa-modal.tsx        # Modal novo CPA
│   │   └── switch-tab.jsx           # Componente tabs
│   ├── lib/
│   │   ├── auth-context.tsx         # Context de autenticação
│   │   ├── api.ts                   # Client API
│   │   └── utils.ts                 # Utilidades
│   ├── public/
│   │   ├── logo.jpg                 # Logo Revenue
│   │   ├── icon-192.png             # Ícone PWA
│   │   ├── manifest.json            # Manifest PWA
│   │   ├── sw.js                    # Service Worker
│   │   └── offline.html             # Página offline
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   └── .env.local
│
├── Revenue-node/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Conexão PostgreSQL
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT & verificação
│   │   ├── routes/
│   │   │   ├── auth.js              # Login/logout
│   │   │   ├── users.js             # CRUD usuários
│   │   │   ├── houses.js            # CRUD casas
│   │   │   ├── cpa.js               # Operações CPA
│   │   │   ├── withdrawals.js       # Saques
│   │   │   └── dashboard.js         # Métricas
│   │   └── index.js                 # Entry point
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── PWA_INSTALL_GUIDE.md             # Guia de instalação PWA
├── TECH_DOCS.md                     # Este arquivo
├── README.md                        # Documentação geral
├── setup.sh                         # Script de setup
└── .gitignore
```

---

## 🔑 Credenciais Padrão

```
Email: admin@bravopanel.com
Senha: Mudar123
```

---

## 🗄️ Banco de Dados

### Tabelas Principais

#### users
- `id`: UUID (primary key)
- `email`: varchar unique
- `password_hash`: varchar (bcrypt)
- `full_name`: varchar
- `role`: 'admin' | 'affiliate'
- `created_at`: timestamp
- `updated_at`: timestamp

#### betting_houses
- `id`: UUID (primary key)
- `name`: varchar
- `cpa_percentage`: decimal
- `affiliate_link`: varchar
- `admin_id`: UUID (foreign key)
- `is_active`: boolean
- `created_at`: timestamp

#### cpa_records
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key)
- `house_id`: UUID (foreign key)
- `amount_cpa`: decimal
- `amount_revenue`: decimal
- `amount_deposits`: decimal
- `registrations`: integer
- `ftd`: integer
- `qftd`: integer
- `date`: date
- `created_at`: timestamp

#### withdrawals
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key)
- `amount`: decimal
- `status`: 'pending' | 'approved' | 'rejected' | 'completed'
- `requested_at`: timestamp
- `completed_at`: timestamp

---

## 🚀 Setup Inicial

### 1. Banco de Dados (PostgreSQL)

```bash
# Crie um banco chamado revenue_db
createdb revenue_db

# Execute os scripts SQL
psql -U postgres -d revenue_db -f scripts/001-create-tables.sql
psql -U postgres -d revenue_db -f scripts/002-seed-admin.sql
```

### 2. Backend

```bash
cd Revenue-node
cp .env.example .env
# Atualize com suas credenciais de banco

npm install
npm start
# Servidor rodará em http://localhost:3001
```

### 3. Frontend

```bash
cd Revenue-app
cp .env.example .env.local
# Atualize a URL da API se necessário

npm install
npm run dev
# App rodará em http://localhost:3000
```

---

## 🎨 Design System

### Cores Principais
- **Primary (Tiffany)**: `#06b6d4` / `#5ECFCF`
- **Secondary (Rosa)**: `#f472b6`
- **Light Pink**: `#fbcfe8`
- **Dark Teal**: `#0891b2`
- **Background**: `#f8fafc`
- **Foreground**: `#0f172a`

### Fonts
- **Heading & Body**: Inter (Google Fonts)

---

## 📱 PWA Features

✅ **Installable**: Adicionar à tela inicial (Android/iOS)
✅ **Offline**: Funciona parcialmente offline com cache
✅ **Responsive**: Mobile-first design
✅ **Bottom Nav**: Menu flutuante no mobile

### Instalação
- **Android**: Chrome → Menu → "Instalar app"
- **iOS**: Safari → Compartilhar → "Adicionar à Tela Inicial"

Ver: [PWA_INSTALL_GUIDE.md](./PWA_INSTALL_GUIDE.md)

---

## 🔐 Autenticação

### Fluxo de Login
1. Usuário faz login com email/senha
2. Backend valida com bcrypt
3. JWT é gerado e armazenado em HTTP-only cookie
4. Frontend redireciona para dashboard

### Proteção de Rotas
- Rotas do dashboard exigem JWT válido
- Admin pode gerenciar usuários
- Afiliados só veem seus próprios dados

---

## 📊 Páginas e Funcionalidades

### Dashboard (Home)
- Cards com métricas principais
- Filtros por período e casa
- Gráficos de receita

### Usuários (Admin)
- CRUD completo
- Criar apenas pelo admin
- Editar email, nome, role

### Casas de Apostas (Admin)
- Cadastrar novas casas
- Editar percentual CPA
- Link de afiliado por casa

### CPA Records
- Registrar novo CPA obtido (FAB button)
- Editar dados de afiliado
- Ver métricas por casa

### Saques
- Solicitar saque
- Admin aprova/rejeita
- Histórico de saques

### Relatórios
- Exportar dados
- Filtrar por período
- Gráficos e estatísticas

---

## 🔧 Variáveis de Ambiente

### Backend (.env)
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=revenue_db
DB_USER=postgres
DB_PASSWORD=sua_senha
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=sua_chave_secreta_minimo_32_chars
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📱 Mobile Navigation

### Menu Inferior (Bottom Nav)
- 🏠 **Home**: Dashboard
- 📋 **Relatórios**: Relatórios
- ➕ **Novo CPA**: FAB central (Modal)
- 💵 **Saques**: Saques
- ☰ **Menu**: Sidebar mobile

---

## 🧪 Testando Localmente

```bash
# Terminal 1 - Backend
cd Revenue-node && npm start

# Terminal 2 - Frontend
cd Revenue-app && npm run dev

# Acesse http://localhost:3000
# Login: admin@bravopanel.com / Mudar123
```

---

## 📤 Deploy

### Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Heroku/Railway/Render (Backend)
```bash
git push heroku main
# Configure variáveis de ambiente na plataforma
```

---

## 📚 Dependências Principais

### Frontend
- Next.js 15+
- React 19+
- TailwindCSS 4
- Lucide React (ícones)

### Backend
- Express.js
- PostgreSQL
- bcryptjs (hashing)
- jsonwebtoken (JWT)
- CORS

---

## 🤝 Contribuição

1. Clone o repositório
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Versão**: 1.0.0  
**Data**: Março 2026  
**Autor**: Revenue Team
