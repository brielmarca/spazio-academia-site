#!/bin/bash
set -e

echo "📦 Instalando dependências..."
cd spazio-backend
npm install

echo "🔧 Gerando Prisma Client..."
npx prisma generate

echo "🗄️ Sincronizando banco de dados..."
npx prisma db push --schema prisma/schema.prisma

echo "🚀 Iniciando servidor..."
npx ts-node --project . src/main/server.ts
