// src/main/routes/subscription.routes.ts
import express, { Router } from 'express';
import * as SubscriptionController from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas de assinatura precisam de autenticação
router.use(authenticate);

// Criar nova assinatura
router.post('/', SubscriptionController.createSubscription);

// Listar minhas assinaturas
router.get('/my', SubscriptionController.getMySubscriptions);

// Verificar se tenho assinatura ativa
router.get('/check', SubscriptionController.checkActiveSubscription);

// Buscar assinatura ativa
router.get('/active', SubscriptionController.getActiveSubscription);

// Buscar assinatura por ID
router.get('/:id', SubscriptionController.getSubscriptionById);

// Cancelar assinatura
router.post('/:id/cancel', SubscriptionController.cancelSubscription);

export function setupSubscriptionRoutes(app: express.Application): void {
  app.use('/api/subscriptions', router);
}

export default router;
