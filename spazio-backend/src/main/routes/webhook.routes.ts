// src/main/routes/webhook.routes.ts
import express, { Router } from 'express';
import * as WebhookController from '../controllers/webhook.controller';

const router = Router();

// Health check
router.get('/health', WebhookController.webhookHealth);

// Webhook principal do AbacatePay
router.post('/abacatepay', WebhookController.handleAbacatePayWebhook);

export function setupWebhookRoutes(app: express.Application): void {
  // Webhooks não usam o prefixo /api
  app.use('/webhook', router);
}

export default router;
