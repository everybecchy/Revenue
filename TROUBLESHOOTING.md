# 🔧 Revenue Panel - Troubleshooting e FAQ

## ⚠️ Problemas Comuns e Soluções

### Backend

#### Erro: "ECONNREFUSED - Connection refused"
**Problema**: Backend não consegue conectar ao banco de dados

**Solução**:
1. Verifique se PostgreSQL está rodando
2. Confirme credenciais no `.env`
3. Teste a conexão:
   ```bash
   psql -h localhost -U postgres -d revenue_db
   ```

#### Erro: "JWT_SECRET is not set"
**Problema**: Variável de ambiente JWT_SECRET falta

**Solução**:
```bash
# No .env do Backend
JWT_SECRET=sua_chave_secreta_super_segura_minimo_32_caracteres
```

#### Erro: "Port 3001 already in use"
**Problema**: Outra aplicação usando a porta 3001

**Solução**:
```bash
# Mude a porta no .env
PORT=3002

# Ou libere a porta (Linux/Mac):
kill -9 $(lsof -ti:3001)
```

---

### Frontend

#### Erro: "NEXT_PUBLIC_API_URL is undefined"
**Problema**: Variável de ambiente não configurada

**Solução**:
```bash
# No .env.local do Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Erro: "Cannot GET /dashboard"
**Problema**: Falha na autenticação ou JWT expirado

**Solução**:
1. Limpe cookies do navegador
2. Limpe o cache: `Ctrl+Shift+Delete`
3. Faça login novamente

#### Erro: "Module not found"
**Problema**: Dependências não instaladas

**Solução**:
```bash
# Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

---

### Banco de Dados

#### Erro: "Database does not exist"
**Problema**: Banco de dados revenue_db não foi criado

**Solução**:
```bash
createdb revenue_db
```

#### Erro: "Permission denied"
**Problema**: Usuário PostgreSQL sem permissões

**Solução**:
```bash
# Conecte como superuser
psql -U postgres -d revenue_db

# Dentro do psql, execute:
GRANT ALL PRIVILEGES ON SCHEMA public TO seu_usuario;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO seu_usuario;
```

#### Erro: "Relation does not exist"
**Problema**: Tabelas não foram criadas

**Solução**:
```bash
# Execute os scripts SQL
psql -U postgres -d revenue_db -f scripts/001-create-tables.sql
psql -U postgres -d revenue_db -f scripts/002-seed-admin.sql
```

---

### Autenticação

#### Login não funciona
**Verificação**:
1. Confirme que admin foi criado:
   ```bash
   psql -U postgres -d revenue_db
   SELECT * FROM users WHERE email = 'admin@bravopanel.com';
   ```

2. Se estiver vazio, execute seed:
   ```bash
   node scripts/seed-admin.js
   ```

#### Senha incorreta
**Resetar Admin**:
```bash
# Usando Node.js
cd Revenue-node
npm install bcryptjs
node -e "
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Mudar123', 10);
console.log('Hash:', hash);
"

# Depois atualize no banco:
psql -U postgres -d revenue_db
UPDATE users SET password_hash = 'COLE_AQUI_O_HASH' 
WHERE email = 'admin@bravopanel.com';
```

---

### PWA

#### App não aparece para instalar
**Verificação**:
1. Abra a página em HTTPS (ou localhost)
2. Aguarde alguns segundos
3. Procure o ícone de instalação (em cima da barra de endereço)

**Solução**:
- Chrome: Menu (⋮) → "Instalar app"
- Safari: Compartilhar (↑) → "Adicionar à Tela Inicial"

#### PWA instalado não abre
**Solução**:
1. Desinstale o app
2. Limpe cache do navegador
3. Reinstale

#### Offline não funciona
**Verificação**:
1. Service Worker está registrado?
   - Abra DevTools → Application → Service Workers
2. Verifica arquivo `/public/sw.js`

---

### Performance

#### Página carregando lentamente
**Checklist**:
- [ ] Há muitos usuários/casas no banco?
- [ ] A query do dashboard é eficiente?
- [ ] Cache do navegador está funcionando?

**Solução**:
```bash
# Frontend - Rebuild
npm run build

# Backend - Adicione índices ao banco
# Em scripts/001-create-tables.sql
CREATE INDEX idx_cpa_user_id ON cpa_records(user_id);
CREATE INDEX idx_cpa_house_id ON cpa_records(house_id);
```

---

## 📊 Monitoramento

### Verificar Saúde do Backend
```bash
curl http://localhost:3001/health
# Resposta esperada: {"status":"ok","timestamp":"..."}
```

### Verificar Logs
```bash
# Backend
tail -f logs/backend.log

# Frontend
npm run dev
# Observe o console
```

---

## 🗄️ Backup e Restore

### Backup do Banco
```bash
pg_dump -U postgres revenue_db > backup.sql
```

### Restore do Banco
```bash
psql -U postgres -d revenue_db < backup.sql
```

---

## 🚀 Deploy

### Para Vercel (Frontend)
```bash
cd Revenue-app
npm install -g vercel
vercel
# Configure variáveis de ambiente no painel
```

### Para Heroku (Backend)
```bash
cd Revenue-node
heroku create revenue-api
heroku config:set DB_HOST=... DB_USER=... etc
git push heroku main
```

---

## 📞 Contato e Suporte

- **Email**: admin@bravopanel.com
- **Docs**: Ver [TECH_DOCS.md](./TECH_DOCS.md)
- **PWA Guide**: Ver [PWA_INSTALL_GUIDE.md](./PWA_INSTALL_GUIDE.md)
