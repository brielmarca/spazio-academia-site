// src/main/controllers/plan.controller.ts
import { Request, Response } from 'express';
import * as PlanService from '../services/plan.service';

/**
 * Listar todos os planos
 * GET /api/plans
 */
export async function getAllPlans(req: Request, res: Response): Promise<void> {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const plans = await PlanService.getAllPlans(includeInactive);
    res.json({ plans });
  } catch (error: any) {
    console.error('Erro ao listar planos:', error);
    res.status(500).json({
      error: error.message || 'Erro ao listar planos',
    });
  }
}

/**
 * Buscar plano por ID
 * GET /api/plans/:id
 */
export async function getPlanById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    const plan = await PlanService.getPlanById(id);
    res.json({ plan });
  } catch (error: any) {
    console.error('Erro ao buscar plano:', error);
    res.status(error.message === 'Plano não encontrado' ? 404 : 500).json({
      error: error.message || 'Erro ao buscar plano',
    });
  }
}

/**
 * Criar novo plano (Admin only)
 * POST /api/plans
 */
export async function createPlan(req: Request, res: Response): Promise<void> {
  try {
    const { name, displayName, description, price, abacatepayPlanId } = req.body;

    if (!name || !displayName || !price) {
      res.status(400).json({
        error: 'Nome, nome de exibição e preço são obrigatórios',
      });
      return;
    }

    const plan = await PlanService.createPlan({
      name,
      displayName,
      description,
      price: Number(price),
      abacatepayPlanId,
    });

    res.status(201).json({ plan });
  } catch (error: any) {
    console.error('Erro ao criar plano:', error);
    res.status(400).json({
      error: error.message || 'Erro ao criar plano',
    });
  }
}

/**
 * Atualizar plano (Admin only)
 * PUT /api/plans/:id
 */
export async function updatePlan(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    const { name, displayName, description, price, abacatepayPlanId, isActive } = req.body;

    const plan = await PlanService.updatePlan(id, {
      name,
      displayName,
      description,
      price: price ? Number(price) : undefined,
      abacatepayPlanId,
      ...(isActive !== undefined && { isActive }),
    });

    res.json({ plan });
  } catch (error: any) {
    console.error('Erro ao atualizar plano:', error);
    res.status(error.message === 'Plano não encontrado' ? 404 : 400).json({
      error: error.message || 'Erro ao atualizar plano',
    });
  }
}

/**
 * Desativar plano (Admin only)
 * DELETE /api/plans/:id
 */
export async function deactivatePlan(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    const plan = await PlanService.deactivatePlan(id);
    res.json({ plan, message: 'Plano desativado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao desativar plano:', error);
    res.status(error.message === 'Plano não encontrado' ? 404 : 400).json({
      error: error.message || 'Erro ao desativar plano',
    });
  }
}

/**
 * Seed de planos padrão
 * POST /api/plans/seed
 */
export async function seedPlans(req: Request, res: Response): Promise<void> {
  try {
    await PlanService.seedDefaultPlans();
    res.json({ message: 'Planos padrão criados com sucesso' });
  } catch (error: any) {
    console.error('Erro ao criar planos padrão:', error);
    res.status(500).json({
      error: error.message || 'Erro ao criar planos padrão',
    });
  }
}
