// src/main/routes/plan.routes.ts
import express, { Router } from 'express';
import * as PlanController from '../controllers/plan.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Rotas públicas
router.get('/', PlanController.getAllPlans);
router.get('/:id', PlanController.getPlanById);

// Rotas de admin
router.post('/', authenticate, requireAdmin, PlanController.createPlan);
router.put('/:id', authenticate, requireAdmin, PlanController.updatePlan);
router.delete('/:id', authenticate, requireAdmin, PlanController.deactivatePlan);

// Seed de planos padrão
router.post('/seed', authenticate, requireAdmin, PlanController.seedPlans);

export function setupPlanRoutes(app: express.Application): void {
  app.use('/api/plans', router);
}

export default router;
