// src/main/routes/auth.routes.ts
import express, { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// Rota temporária para criar admin (remover em produção)
router.post('/create-admin', async (req, res) => {
  try {
    const adminEmail = 'admin@spazio.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      return res.json({ message: 'Admin já existe', email: adminEmail });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    res.json({ message: 'Admin criado', email: admin.email });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
