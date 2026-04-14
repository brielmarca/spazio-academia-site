// src/main/routes/auth.routes.ts
import express, { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Rotas públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Rotas protegidas
router.get('/me', authenticate, AuthController.getProfile);
router.put('/me', authenticate, AuthController.updateProfile);
router.put('/change-password', authenticate, AuthController.changePassword);
router.get('/verify', authenticate, AuthController.verifyToken);

export function setupAuthRoutes(app: express.Application): void {
  app.use('/api/auth', router);
}

export default router;
