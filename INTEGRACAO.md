# 🏋️ Spazio Academia - Guia de Integração

Este guia explica como configurar, testar e usar o sistema completo de autenticação, planos e pagamentos via AbacatePay.

---

## 📁 Estrutura de Arquivos Criada

### Backend (`spazio-backend/src/main/`)

```
src/main/
├── server.ts                    # Atualizado com novas rotas
├── prisma.ts                    # Já existia
├── types/
│   └── index.ts                 # Tipos TypeScript
├── middleware/
│   └── auth.middleware.ts       # JWT middleware
├── services/
│   ├── auth.service.ts          # Login/registro
│   ├── plan.service.ts          # CRUD de planos
│   ├── subscription.service.ts  # Integração AbacatePay
│   └── lead.service.ts          # Atualizado para modelo Lead
├── controllers/
│   ├── auth.controller.ts       # Auth endpoints
│   ├── plan.controller.ts       # Planos endpoints
│   ├── subscription.controller.ts  # Assinaturas endpoints
│   ├── webhook.controller.ts    # Webhook AbacatePay
│   └── lead.controller.ts       # Atualizado
└── routes/
    ├── auth.routes.ts           # /auth
    ├── plan.routes.ts           # /plans
    ├── subscription.routes.ts   # /subscriptions
    ├── webhook.routes.ts        # /webhook
    └── lead.routes.ts           # Já existia
```

### Frontend (`spazio-frontend/src/`)

```
src/
├── App.tsx                      # Rotas atualizadas
├── components/
│   └── PrivateRoute.tsx         # Proteção de rotas
├── pages/
│   ├── Login.tsx                # Página de login/registro
│   └── Plans.tsx                # Página de planos
└── services/
    ├── api.ts                   # API base
    ├── auth.ts                  # Serviço de autenticação
    └── subscription.ts          # Serviço de assinaturas
```

---

## 🚀 Passo a Passo para Rodar

### 1. Instalar Dependências

```bash
# Backend
cd spazio-backend
npm install

# Frontend (em outro terminal)
cd spazio-frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` do backend já foi atualizado com:

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="spazio-secret-key-change-in-production-2025"
JWT_EXPIRES_IN="7d"

# AbacatePay Configuration
ABACATEPAY_SECRET_KEY="sua_secret_key_do_abacatepay_aqui"
ABACATEPAY_PUBLIC_KEY="sua_public_key_do_abacatepay_aqui"

# Webhook Configuration
WEBHOOK_SECRET="webhook-secret-spazio-2025"

# Frontend URL (para CORS)
FRONTEND_URL="http://localhost:5173"

# Server Port
PORT="3001"
```

**IMPORTANTE:** Você precisa obter as credenciais do AbacatePay em: https://abacatepay.com

### 3. Rodar o Backend

```bash
cd spazio-backend
npm run dev
```

Servidor estará rodando em: `http://localhost:3001`

Endpoints disponíveis:
- `GET http://localhost:3001/` - Health check
- `GET http://localhost:3001/api/leads` - Listar leads
- `POST http://localhost:3001/api/auth/register` - Registro
- `POST http://localhost:3001/api/auth/login` - Login
- `GET http://localhost:3001/api/plans` - Listar planos
- `GET http://localhost:3001/api/webhook/health` - Webhook health

### 4. Rodar o Frontend

```bash
cd spazio-frontend
npm run dev
```

Aplicação estará em: `http://localhost:5173`

---

## 🔗 Configurando Webhooks com Ngrok

Para receber webhooks do AbacatePay em desenvolvimento, você precisa expor seu localhost com **ngrok**.

### Instalar Ngrok

```bash
# Windows (com Chocolatey)
choco install ngrok

# Mac
brew install ngrok

# Linux
snap install ngrok
```

### Configurar Ngrok

1. Crie uma conta em https://ngrok.com
2. Configure seu authtoken:
```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

### Expor o Backend

```bash
# O backend está na porta 3001
ngrok http 3001
```

O ngrok vai gerar uma URL pública, exemplo:
```
Forwarding https://abc123.ngrok.io -> http://localhost:3001
```

**Copie essa URL** (ex: `https://abc123.ngrok.io`)

### Configurar Webhook no AbacatePay

1. Acesse o dashboard do AbacatePay
2. Vá em "Webhooks"
3. Adicione a URL: `https://abc123.ngrok.io/webhook/abacatepay`
4. Selecione os eventos:
   - `payment.approved`
   - `payment.failed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`

### Configurar Frontend para usar URL do Ngrok

Se você quiser testar o fluxo completo, atualize o `api.ts` do frontend para apontar para o ngrok (apenas em desenvolvimento):

```typescript
// src/services/api.ts
const API_BASE_URL = 'https://abc123.ngrok.io/api'; // URL do ngrok
```

---

## 🧪 Como Testar

### Fluxo Completo:

1. **Criar Conta**
   - Acesse `http://localhost:5173/login`
   - Clique em "Crie uma agora"
   - Preencha: nome, email, telefone, senha
   - Clique em "Criar Conta"

2. **Escolher Plano**
   - Será redirecionado para `/planos`
   - Veja os 4 planos disponíveis (criados automaticamente)
   - Clique em "Assinar Agora" no plano desejado

3. **Pagamento**
   - Um modal aparecerá com link para pagamento
   - Clique em "Ir para Pagamento"
   - Complete o pagamento no AbacatePay (use cartão de teste)

4. **Webhook**
   - O AbacatePay enviará webhooks para seu endpoint
   - Verifique no console do backend:
   ```
   📩 Webhook recebido: payment.approved
   ✅ Assinatura XYZ ativada
   ```

5. **Verificar Status**
   - Recarregue a página de planos
   - O plano deve aparecer como "ASSINATURA ATIVA"

---

## 🔧 Testes Manuais de API

### Registro (POST /api/auth/register)
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123",
    "phone": "(11) 99999-9999"
  }'
```

### Login (POST /api/auth/login)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Listar Planos (GET /api/plans)
```bash
curl http://localhost:3001/api/plans
```

### Criar Assinatura (POST /api/subscriptions)
```bash
# Primeiro faça login para obter o token
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "planId": 1
  }'
```

### Simular Webhook (POST /webhook/abacatepay)
```bash
curl -X POST http://localhost:3001/webhook/abacatepay \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: webhook-secret-spazio-2025" \
  -d '{
    "event": "payment.approved",
    "data": {
      "id": "pay_123",
      "subscription": {
        "id": "sub_abc123"
      }
    }
  }'
```

---

## 📋 Cartões de Teste do AbacatePay

Use estes cartões para testar pagamentos:

| Número do Cartão | Resultado |
|------------------|-----------|
| `4242424242424242` | Pagamento aprovado |
| `4000000000000002` | Pagamento recusado |
| `4000000000009995` | Saldo insuficiente |

**Dados adicionais:**
- Validade: qualquer data futura (ex: 12/25)
- CVV: qualquer 3 dígitos (ex: 123)
- Nome: qualquer nome

---

## 🗄️ Estrutura do Banco de Dados

### Models Prisma:

**User:**
- id, name, email, password, phone, role, createdAt, updatedAt

**Plan:**
- id, name, displayName, description, price, abacatepayPlanId, isActive

**Subscription:**
- id, userId, planId, abacatepayCustomerId, abacatepaySubscriptionId
- status (PENDING, ACTIVE, PAST_DUE, CANCELED, EXPIRED)
- currentPeriodStart, currentPeriodEnd, cancelAtPeriodEnd

**Lead:**
- id, nome, email, telefone, status (NEW, CONTACTED, CONVERTED, LOST)

---

## 🐛 Troubleshooting

### Erro "Token inválido"
- Verifique se o token está salvo no localStorage
- Faça logout e login novamente

### Erro CORS
- Verifique se `FRONTEND_URL` no `.env` está correto
- Padrão: `http://localhost:5173`

### Webhook não recebido
- Verifique se o ngrok está rodando
- Verifique a URL do webhook no dashboard do AbacatePay
- Verifique os logs do backend

### Pagamento não atualiza status
- Verifique se o webhook está configurado corretamente
- Verifique se o `WEBHOOK_SECRET` está correto
- Teste o webhook manualmente com curl

### Erro "Email já existe"
- O email já está cadastrado como User ou Lead
- Use outro email para teste

---

## 📚 API Endpoints Reference

### Autenticação
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Criar conta | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Perfil | ✅ |
| PUT | `/api/auth/me` | Atualizar perfil | ✅ |
| PUT | `/api/auth/change-password` | Alterar senha | ✅ |

### Planos
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/plans` | Listar planos | ❌ |
| GET | `/api/plans/:id` | Buscar plano | ❌ |
| POST | `/api/plans` | Criar plano | ✅ (Admin) |
| PUT | `/api/plans/:id` | Atualizar plano | ✅ (Admin) |
| DELETE | `/api/plans/:id` | Desativar plano | ✅ (Admin) |

### Assinaturas
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/subscriptions/my` | Minhas assinaturas | ✅ |
| GET | `/api/subscriptions/active` | Assinatura ativa | ✅ |
| GET | `/api/subscriptions/check` | Verificar status | ✅ |
| GET | `/api/subscriptions/:id` | Buscar assinatura | ✅ |
| POST | `/api/subscriptions` | Criar assinatura | ✅ |
| POST | `/api/subscriptions/:id/cancel` | Cancelar | ✅ |

### Webhooks
| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/webhook/abacatepay` | Receber eventos | ❌ (Valida secret) |
| GET | `/webhook/health` | Health check | ❌ |

---

## 🎨 Cores e Design

O frontend mantém o design existente com Tailwind:
- `spazio-dark`: Cor primária escura
- `spazio-gold`: Destaque/dourado
- `spazio-accent`: Cor de ação

---

## 📝 Próximos Passos

1. **Em produção:**
   - Altere `JWT_SECRET` para uma chave forte
   - Altere `WEBHOOK_SECRET` para uma chave segura
   - Configure HTTPS para webhooks
   - Use PostgreSQL em vez de SQLite

2. **Features opcionais:**
   - Recuperação de senha
   - Dashboard admin completo
   - Histórico de pagamentos
   - Notificações por email

---

## 💬 Suporte

Para dúvidas sobre:
- **AbacatePay**: https://docs.abacatepay.com
- **Prisma**: https://www.prisma.io/docs
- **React Router**: https://reactrouter.com

---

**Feito com 💪 por Spazio Academia**
