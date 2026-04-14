# Render Deployment Guide

## 1. Criar Banco de Dados PostgreSQL no Render
1. Acesse https://render.com
2. New → PostgreSQL
3. Configure:
   - Name: spazio-db
   - Database: spazio_db
   - User: spazio_user
4. Após criar, copie a "Internal Database URL"

## 2. Criar Web Service para o Backend
1. New → Web Service
2. Conecte seu repositório GitHub
3. Configure:
   - Name: spazio-backend
   - Root Directory: spazio-backend
   - Build Command: npm run build
   - Start Command: npm start
4. Add Environment Variables:
   - DATABASE_URL: (cola a URL do PostgreSQL)
   - JWT_SECRET: (gere uma string aleatória)
   - FRONTEND_URL: (URL do seu frontend na Vercel)
   - PORT: 3001

## 3. Deploy Frontend na Vercel
1. Acesse https://vercel.com
2. New Project → Import GitHub
3. Selecione spazio-frontend
4. Deploy

## Variáveis de Ambiente Necessárias:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=sua-chave-secreta-aqui
FRONTEND_URL=https://seu-site.vercel.app
PORT=3001
```