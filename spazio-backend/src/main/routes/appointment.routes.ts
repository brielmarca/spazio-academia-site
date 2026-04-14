// src/main/routes/appointment.routes.ts
import express, { Router } from 'express';
import * as AppointmentController from '../controllers/appointment.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, AppointmentController.createAppointment);
router.get('/my', authenticate, AppointmentController.getMyAppointments);
router.get('/upcoming', authenticate, AppointmentController.getUpcomingAppointments);
router.get('/:id', AppointmentController.getAppointmentById);
router.post('/:id/cancel', authenticate, AppointmentController.cancelAppointment);

router.get('/trainer/:trainerId', authenticate, requireAdmin, AppointmentController.getTrainerAppointments);

export function setupAppointmentRoutes(app: express.Application): void {
  app.use('/api/appointments', router);
}

export default router;
