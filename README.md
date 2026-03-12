# 🚀 Revenue Panel - CPA Management Dashboard

Um painel administrativo moderno para gerenciamento de afiliados e CPA de casas de apostas, com arquitetura separada Frontend/Backend, PWA, e suporte mobile.

## ✨ Features

- ✅ **Autenticação segura**: Login com email/senha + JWT
- ✅ **Admin Control**: Apenas admin pode criar usuários
- ✅ **CRUD Completo**: Usuários, Casas, CPA Records, Saques
- ✅ **Dashboard Responsivo**: Desktop e mobile
- ✅ **PWA**: Instalar no celular (iOS/Android)
- ✅ **Bottom Navigation**: Menu flutuante mobile com FAB
- ✅ **Design Moderno**: Cores rosa claro + azul tiffany
- ✅ **Offline Support**: Funciona parcialmente offline

---

## 📋 Pré-requisitos

- **Node.js** 22+ 
- **PostgreSQL** 12+
- **npm** ou **yarn**

---

## 🛠️ Instalação Rápida

### 1️⃣ Clone e Instale

```bash
# Clone o repositório (já feito)
cd Revenue

# Execute o script de setup
chmod +x setup.sh
./setup.sh

# Ou manualmente:
cd Revenue-node && npm install
cd ../Revenue-app && npm install
```

### 2️⃣ Configure Variaveis de Ambiente

**Backend** (`Revenue-node/.env`):
```env
# Prisma Database URL
DATABASE_URL="postgres://usuario:senha@host:5432/database"
JWT_SECRET=sua_chave_secreta_super_segura_minimo_32_caracteres
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3️⃣ Configure o Banco de Dados com Prisma

```bash
cd Revenue-node

# Instalar dependencias
npm install

# Gerar cliente Prisma
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Popular com admin e casas de exemplo
npm run db:seed
```

### 4️⃣ Configure o Frontend

**Frontend** (`Revenue-app/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5️⃣ Inicie os Servidores

```bash
# Terminal 1 - Backend (porta 3001)
cd Revenue-node
npm start

# Terminal 2 - Frontend (porta 3000)
cd Revenue-app
npm run dev
```

### 6️⃣ Acesse a Aplicacao

🔗 **http://localhost:3000**

**Credenciais Demo:**
```
Email: admin@bravopanel.com
Senha: Mudar123
```

---

## 📁 Estrutura de Arquivos

```
Revenue/
├── scripts/              # SQL & scripts de setup
├── Revenue-app/         # Frontend Next.js + PWA
├── Revenue-node/        # Backend Express.js
├── TECH_DOCS.md        # Documentação técnica completa
├── PWA_INSTALL_GUIDE.md # Como instalar no mobile
└── README.md           # Este arquivo
```

Ver [TECH_DOCS.md](./TECH_DOCS.md) para estrutura completa.

---

## 🎨 Design & Cores

| Cor | Código | Uso |
|-----|--------|-----|
| **Tiffany** | `#06b6d4` | Primary, botões |
| **Rosa Claro** | `#f472b6` | Secondary, accents |
| **Light Pink** | `#fbcfe8` | Backgrounds |
| **Dark Teal** | `#0891b2` | Borders, hovers |

---

## 📱 Mobile PWA

### Instalar no Android
1. Abra no Chrome
2. Menu (⋮) → "Instalar app"
3. Confirme

### Instalar no iOS
1. Abra no Safari
2. Compartilhar (↑) → "Adicionar à Tela Inicial"
3. Nomear e confirmar

📖 Guia completo: [PWA_INSTALL_GUIDE.md](./PWA_INSTALL_GUIDE.md)

---

## 📊 Funcionalidades

### 🏠 Dashboard
- Métricas principais em cards
- Filtros por período e casa
- Gráficos de receita

### 👥 Gerenciar Usuários (Admin)
- CRUD de usuários
- Criar novos afiliados
- Editar perfis

### 🎰 Casas de Apostas (Admin)
- Cadastrar casas de apostas
- Definir % CPA
- Adicionar link de afiliado

### 💰 CPA Records
- Registrar novo CPA (botão FAB)
- Editar dados de afiliado
- Ver métricas por casa

### 💵 Saques
- Solicitar saque
- Admin aprova/rejeita
- Histórico de movimentação

### 📈 Relatórios
- Filtrar dados
- Exportar relatórios
- Gráficos e análises

---

## 🔐 Segurança

- ✅ Senhas com bcrypt
- ✅ JWT para autenticação
- ✅ HTTP-only cookies
- ✅ CORS configurado
- ✅ Validação de entrada

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm install -g vercel
cd Revenue-app
vercel
```

### Backend (Heroku/Railway/Render)
```bash
# Configure variáveis de ambiente na plataforma
git push heroku main
```

---

## 🤝 Suporte

**Dúvidas?** 
- Leia [TECH_DOCS.md](./TECH_DOCS.md)
- Verifique [PWA_INSTALL_GUIDE.md](./PWA_INSTALL_GUIDE.md)
- Email: admin@bravopanel.com

---

## 📝 License

© 2026 Revenue Panel. Todos os direitos reservados.

---

**Status**: ✅ Pronto para produção  
**Versão**: 1.0.0  
**Última atualização**: Março 2026
