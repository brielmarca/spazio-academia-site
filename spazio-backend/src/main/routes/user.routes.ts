// src/main/routes/user.routes.ts
import express, { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação e ser admin
router.use(authenticate);
router.use(requireAdmin);

// Rotas de usuários
router.get('/', UserController.listUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export function setupUserRoutes(app: express.Application): void {
  app.use('/api/users', router);
}

export default router;
