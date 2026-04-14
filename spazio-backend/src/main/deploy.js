// src/main/deploy.js - Script de deploy
const { spawn } = require('child_process');
const path = require('path');

console.log('📦 Sincronizando banco de dados...');

const prismaPush = spawn('npx', ['prisma', 'db', 'push', '--skip-generate'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

prismaPush.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Banco sincronizado!');
    console.log('🚀 Iniciando servidor...');
    
    const server = spawn('npx', ['ts-node', '--project', '.', 'src/main/server.ts'], {
      cwd: __dirname,
      shell: true,
      stdio: 'inherit'
    });
  } else {
    console.error('❌ Erro ao sincronizar banco');
    process.exit(1);
  }
});
