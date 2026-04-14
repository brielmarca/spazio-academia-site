// src/main/controllers/subscription.controller.ts
import { Response } from 'express';
import * as SubscriptionService from '../services/subscription.service';
import { AuthenticatedRequest } from '../types';

/**
 * Criar nova assinatura
 * POST /api/subscriptions
 */
export async function createSubscription(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const { planId } = req.body;

    if (!planId) {
      res.status(400).json({
        error: 'ID do plano é obrigatório',
      });
      return;
    }

    const result = await SubscriptionService.createSubscription({
      userId: req.user.id,
      planId: Number(planId),
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Erro ao criar assinatura:', error);
    res.status(400).json({
      error: error.message || 'Erro ao criar assinatura',
    });
  }
}

/**
 * Listar assinaturas do usuário logado
 * GET /api/subscriptions/my
 */
export async function getMySubscriptions(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const subscriptions = await SubscriptionService.getUserSubscriptions(
      req.user.id
    );

    res.json({ subscriptions });
  } catch (error: any) {
    console.error('Erro ao listar assinaturas:', error);
    res.status(500).json({
      error: error.message || 'Erro ao listar assinaturas',
    });
  }
}

/**
 * Buscar assinatura ativa do usuário
 * GET /api/subscriptions/active
 */
export async function getActiveSubscription(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const subscription = await SubscriptionService.getActiveSubscription(
      req.user.id
    );

    if (!subscription) {
      res.status(404).json({
        error: 'Nenhuma assinatura ativa encontrada',
      });
      return;
    }

    res.json({ subscription });
  } catch (error: any) {
    console.error('Erro ao buscar assinatura ativa:', error);
    res.status(500).json({
      error: error.message || 'Erro ao buscar assinatura ativa',
    });
  }
}

/**
 * Buscar detalhes de uma assinatura
 * GET /api/subscriptions/:id
 */
export async function getSubscriptionById(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const id = parseInt(req.params.id as string);
    const subscription = await SubscriptionService.getSubscriptionById(id);

    // Verificar se a assinatura pertence ao usuário
    if (subscription.userId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({
        error: 'Acesso negado',
      });
      return;
    }

    res.json({ subscription });
  } catch (error: any) {
    console.error('Erro ao buscar assinatura:', error);
    res.status(
      error.message === 'Assinatura não encontrada' ? 404 : 500
    ).json({
      error: error.message || 'Erro ao buscar assinatura',
    });
  }
}

/**
 * Cancelar assinatura
 * POST /api/subscriptions/:id/cancel
 */
export async function cancelSubscription(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const id = parseInt(req.params.id as string);
    const { cancelAtPeriodEnd = true } = req.body;

    const subscription = await SubscriptionService.cancelSubscription(
      id,
      req.user.id,
      cancelAtPeriodEnd
    );

    res.json({
      subscription,
      message: cancelAtPeriodEnd
        ? 'Assinatura será cancelada ao final do período atual'
        : 'Assinatura cancelada imediatamente',
    });
  } catch (error: any) {
    console.error('Erro ao cancelar assinatura:', error);
    res.status(
      error.message === 'Assinatura não encontrada' ? 404 : 400
    ).json({
      error: error.message || 'Erro ao cancelar assinatura',
    });
  }
}

/**
 * Verificar se usuário tem assinatura ativa
 * GET /api/subscriptions/check
 */
export async function checkActiveSubscription(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Não autorizado' });
      return;
    }

    const hasActive = await SubscriptionService.hasActiveSubscription(
      req.user.id
    );
    const activeSubscription = hasActive
      ? await SubscriptionService.getActiveSubscription(req.user.id)
      : null;

    res.json({
      hasActiveSubscription: hasActive,
      subscription: activeSubscription,
    });
  } catch (error: any) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).json({
      error: error.message || 'Erro ao verificar assinatura',
    });
  }
}
