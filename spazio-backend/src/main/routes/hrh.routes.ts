// src/main/routes/hrh.routes.ts
import express, { Router } from 'express';
import * as HrhController from '../controllers/hrh.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Rotas de horários (HRH)
router.post('/', HrhController.createHrh);
router.get('/', HrhController.listHrh);
router.get('/available', HrhController.getAvailableHrh);
router.get('/agenda', HrhController.getProfessorAgenda);
router.get('/:id', HrhController.getHrhById);
router.put('/:id', HrhController.updateHrh);
router.delete('/:id', HrhController.deleteHrh);

// Reservar horário
router.post('/:id/reserve', HrhController.reserveHrh);
router.post('/:id/cancel', HrhController.cancelReserveHrh);

// Resetar horários expirados (admin)
router.post('/reset-expired', HrhController.resetExpiredHrh);

export function setupHrhRoutes(app: express.Application): void {
  app.use('/api/hrh', router);
}

export default router;
