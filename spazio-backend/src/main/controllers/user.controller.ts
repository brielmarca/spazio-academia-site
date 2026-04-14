// src/main/controllers/user.controller.ts
import { Response, Request } from 'express';
import * as AuthService from '../services/auth.service';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../types';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Listar todos os usuários (admin only)
 * GET /api/users
 */
export async function listUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Buscar usuário por ID
 * GET /api/users/:id
 */
export async function getUserById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Criar usuário (admin only)
 * POST /api/users
 */
export async function createUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Dados incompletos' });
      return;
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email já está em uso' });
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Atualizar usuário (admin only)
 * PUT /api/users/:id
 */
export async function updateUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Verificar se email está sendo alterado e se já existe
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        res.status(400).json({ error: 'Email já está em uso' });
        return;
      }
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(role && { role: role as Role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Excluir usuário (admin only)
 * DELETE /api/users/:id
 */
export async function deleteUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    // Não permitir excluir a si mesmo
    if (existingUser.id === req.user!.id) {
      res.status(400).json({ error: 'Você não pode excluir sua própria conta' });
      return;
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
