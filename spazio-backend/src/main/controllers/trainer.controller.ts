// src/main/controllers/trainer.controller.ts
import { Request, Response } from 'express';
import * as TrainerService from '../services/trainer.service';

/**
 * Listar todos os professores
 * GET /api/trainers
 */
export async function getAllTrainers(req: Request, res: Response): Promise<void> {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const trainers = await TrainerService.getAllTrainers(includeInactive);
    res.json({ trainers });
  } catch (error: any) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ error: error.message || 'Erro ao listar professores' });
  }
}

/**
 * Buscar professor por ID
 * GET /api/trainers/:id
 */
export async function getTrainerById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    const trainer = await TrainerService.getTrainerById(id);
    res.json({ trainer });
  } catch (error: any) {
    console.error('Erro ao buscar professor:', error);
    res.status(error.message === 'Professor não encontrado' ? 404 : 500).json({
      error: error.message || 'Erro ao buscar professor',
    });
  }
}

/**
 * Obter horários disponíveis
 * GET /api/trainers/:id/availability
 */
export async function getAvailableSlots(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = parseInt(req.params.id as string);
    const dateStr = req.query.date as string;

    if (!dateStr) {
      res.status(400).json({ error: 'Data é obrigatória (formato: YYYY-MM-DD)' });
      return;
    }

    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) {
      res.status(400).json({ error: 'Data inválida' });
      return;
    }

    const slots = await TrainerService.getAvailableSlots(trainerId, date);
    res.json({ slots, date: dateStr });
  } catch (error: any) {
    console.error('Erro ao buscar disponibilidade:', error);
    res.status(500).json({ error: error.message || 'Erro ao buscar disponibilidade' });
  }
}

/**
 * Criar professor (Admin only)
 * POST /api/trainers
 */
export async function createTrainer(req: Request, res: Response): Promise<void> {
  try {
    const { name, role, bio, image, specialties } = req.body;

    if (!name || !role) {
      res.status(400).json({ error: 'Nome e função são obrigatórios' });
      return;
    }

    const trainer = await TrainerService.createTrainer({
      name,
      role,
      bio,
      image,
      specialties,
    });

    res.status(201).json({ trainer });
  } catch (error: any) {
    console.error('Erro ao criar professor:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar professor' });
  }
}

/**
 * Adicionar disponibilidade (Admin only)
 * POST /api/trainers/:id/availability
 */
export async function createAvailability(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = parseInt(req.params.id as string);
    const { dayOfWeek, startTime, endTime } = req.body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      res.status(400).json({ error: 'Dia da semana, horário de início e fim são obrigatórios' });
      return;
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      res.status(400).json({ error: 'Dia da semana deve ser entre 0 (Domingo) e 6 (Sábado)' });
      return;
    }

    const availability = await TrainerService.createAvailability({
      trainerId,
      dayOfWeek,
      startTime,
      endTime,
    });

    res.status(201).json({ availability });
  } catch (error: any) {
    console.error('Erro ao criar disponibilidade:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar disponibilidade' });
  }
}

/**
 * Remover disponibilidade (Admin only)
 * DELETE /api/trainers/availability/:id
 */
export async function deleteAvailability(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    await TrainerService.deleteAvailability(id);
    res.json({ message: 'Disponibilidade removida com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover disponibilidade:', error);
    res.status(400).json({ error: error.message || 'Erro ao remover disponibilidade' });
  }
}

/**
 * Seed de professores padrão
 * POST /api/trainers/seed
 */
export async function seedTrainers(req: Request, res: Response): Promise<void> {
  try {
    await TrainerService.seedDefaultTrainers();
    res.json({ message: 'Professores padrão criados com sucesso' });
  } catch (error: any) {
    console.error('Erro ao criar professores padrão:', error);
    res.status(500).json({ error: error.message || 'Erro ao criar professores padrão' });
  }
}
