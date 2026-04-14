// src/main/routes/payment.routes.ts
import express, { Router } from 'express';
import * as PaymentController from '../controllers/payment.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Dashboard de pagamentos (admin)
router.get('/dashboard', requireAdmin, PaymentController.getPaymentDashboard);

// Rotas de pagamentos
router.post('/', PaymentController.createPayment);
router.get('/', PaymentController.listPayments);
router.get('/:id', PaymentController.getPaymentById);

// Ações admin
router.post('/:id/approve', requireAdmin, PaymentController.approvePayment);
router.post('/:id/reject', requireAdmin, PaymentController.rejectPayment);
router.post('/:id/refund', requireAdmin, PaymentController.refundPayment);

export function setupPaymentRoutes(app: express.Application): void {
  app.use('/api/payments', router);
}

export default router;
