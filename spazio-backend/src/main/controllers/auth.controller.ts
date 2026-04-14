// src/main/controllers/auth.controller.ts
import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { AuthenticatedRequest } from '../types';

/**
 * Registrar novo usuário
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, phone } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      res.status(400).json({
        error: 'Nome, email e senha são obrigatórios',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        error: 'A senha deve ter no mínimo 6 caracteres',
      });
      return;
    }

    const result = await AuthService.register({
      name,
      email,
      password,
      phone,
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Erro no registro:', error);
    res.status(400).json({
      error: error.message || 'Erro ao criar usuário',
    });
  }
}

/**
 * Login de usuário
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      res.status(400).json({
        error: 'Email e senha são obrigatórios',
      });
      return;
    }

    const result = await AuthService.login({
      email,
      password,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Erro no login:', error);
    res.status(401).json({
      error: error.message || 'Erro ao fazer login',
    });
  }
}

/**
 * Obter perfil do usuário logado
 * GET /api/auth/me
 */
export async function getProfile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const user = await AuthService.getUserById(req.user.id);
    res.json({ user });
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error);
    res.status(400).json({
      error: error.message || 'Erro ao buscar perfil',
    });
  }
}

/**
 * Atualizar perfil do usuário
 * PUT /api/auth/me
 */
export async function updateProfile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const { name, phone } = req.body;
    const user = await AuthService.updateUser(req.user.id, { name, phone });
    res.json({ user });
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(400).json({
      error: error.message || 'Erro ao atualizar perfil',
    });
  }
}

/**
 * Alterar senha do usuário
 * PUT /api/auth/change-password
 */
export async function changePassword(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        error: 'Senha atual e nova senha são obrigatórias',
      });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({
        error: 'A nova senha deve ter no mínimo 6 caracteres',
      });
      return;
    }

    const result = await AuthService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.json(result);
  } catch (error: any) {
    console.error('Erro ao alterar senha:', error);
    res.status(400).json({
      error: error.message || 'Erro ao alterar senha',
    });
  }
}

/**
 * Verificar token
 * GET /api/auth/verify
 */
export async function verifyToken(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    res.json({
      valid: true,
      user: req.user,
    });
  } catch (error: any) {
    res.status(401).json({
      valid: false,
      error: error.message || 'Token inválido',
    });
  }
}
