// src/main/server.ts
import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { setupLeadRoutes } from './routes/lead.routes';
import { setupAuthRoutes } from './routes/auth.routes';
import { setupPlanRoutes } from './routes/plan.routes';
import { setupSubscriptionRoutes } from './routes/subscription.routes';
import { setupWebhookRoutes } from './routes/webhook.routes';
import { setupTrainerRoutes } from './routes/trainer.routes';
import { setupAppointmentRoutes } from './routes/appointment.routes';
import { setupHrhRoutes } from './routes/hrh.routes';
import { setupContractRoutes } from './routes/contract.routes';
import { setupPaymentRoutes } from './routes/payment.routes';
import { setupUserRoutes } from './routes/user.routes';
import { seedDefaultPlans } from './services/plan.service';
import { seedDefaultTrainers } from './services/trainer.service';

const prisma = new PrismaClient();

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware JSON - deve vir antes do CORS
app.use(express.json({ type: 'application/json' }));

// Middleware CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'https://spazio-academia-site-8axb.vercel.app',
    'https://spazio-academia-site-*.vercel.app',
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.some(o => o.includes('vercel') ? origin.includes('vercel') : origin === o)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'API da Academia Spazio está no ar! 🚀',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      plans: '/api/plans',
      subscriptions: '/api/subscriptions',
      leads: '/api',
      webhook: '/webhook',
    },
  });
});

// Configurar rotas
setupLeadRoutes(app);
setupAuthRoutes(app);
setupPlanRoutes(app);
setupSubscriptionRoutes(app);
setupWebhookRoutes(app);
setupTrainerRoutes(app);
setupAppointmentRoutes(app);
setupHrhRoutes(app);
setupContractRoutes(app);
setupPaymentRoutes(app);
setupUserRoutes(app);

// Inicializar banco e servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/`);

  // Sincronizar banco de dados
  try {
    await prisma.$connect();
    console.log('✅ Banco de dados conectado');
    
    // Executar seed
    await seedDefaultPlans();
    await seedDefaultTrainers();
  } catch (error) {
    console.error('❌ Erro ao conectar banco:', error);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
