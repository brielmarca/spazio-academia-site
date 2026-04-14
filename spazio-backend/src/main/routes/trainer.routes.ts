// src/main/routes/trainer.routes.ts
import express, { Router } from 'express';
import * as TrainerController from '../controllers/trainer.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', TrainerController.getAllTrainers);
router.get('/:id', TrainerController.getTrainerById);
router.get('/:id/availability', TrainerController.getAvailableSlots);

router.post('/', authenticate, requireAdmin, TrainerController.createTrainer);
router.post('/:id/availability', authenticate, requireAdmin, TrainerController.createAvailability);
router.post('/seed', authenticate, requireAdmin, TrainerController.seedTrainers);

router.delete('/availability/:id', authenticate, requireAdmin, TrainerController.deleteAvailability);

export function setupTrainerRoutes(app: express.Application): void {
  app.use('/api/trainers', router);
}

export default router;
