// src/main/controllers/hrh.controller.ts
import { Response, Request } from 'express';
import * as HrhService from '../services/hrh.service';
import { AuthenticatedRequest } from '../types';
import { HrhStatus } from '@prisma/client';

/**
 * Criar novo horário (HRH)
 * POST /api/hrh
 */
export async function createHrh(req: AuthenticatedRequest, res: Response) {
  try {
    const { dataHora, duracao } = req.body;
    const professorId = req.user!.id;

    if (!dataHora) {
      res.status(400).json({ error: 'Data e hora são obrigatórios' });
      return;
    }

    const hrh = await HrhService.createHrh({
      professorId,
      dataHora: new Date(dataHora),
      duracao,
    });

    res.status(201).json(hrh);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Listar horários
 * GET /api/hrh
 */
export async function listHrh(req: AuthenticatedRequest, res: Response) {
  try {
    const { professorId, status, startDate, endDate } = req.query;

    const filters: any = {};

    if (professorId) filters.professorId = Number(professorId);
    if (status) filters.status = status as HrhStatus;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    // Se não for admin, só mostra do professor logado
    if (req.user!.role !== 'ADMIN') {
      filters.professorId = req.user!.id;
    }

    const hrhs = await HrhService.listHrh(filters);
    res.json(hrhs);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Buscar horário por ID
 * GET /api/hrh/:id
 */
export async function getHrhById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const hrh = await HrhService.getHrhById(Number(id));

    // Verificar permissão
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'PROFESSOR') {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    if (req.user!.role === 'PROFESSOR' && hrh.professorId !== req.user!.id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    res.json(hrh);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * Atualizar horário
 * PUT /api/hrh/:id
 */
export async function updateHrh(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { dataHora, duracao, status } = req.body;

    const hrh = await HrhService.getHrhById(Number(id));

    // Verificar permissão - só professor dono ou admin
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'PROFESSOR') {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    if (req.user!.role === 'PROFESSOR' && hrh.professorId !== req.user!.id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const updated = await HrhService.updateHrh(Number(id), {
      dataHora: dataHora ? new Date(dataHora) : undefined,
      duracao,
      status,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Excluir horário
 * DELETE /api/hrh/:id
 */
export async function deleteHrh(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const hrh = await HrhService.getHrhById(Number(id));

    // Verificar permissão
    if (req.user!.role !== 'ADMIN' && req.user!.role !== 'PROFESSOR') {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    if (req.user!.role === 'PROFESSOR' && hrh.professorId !== req.user!.id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    await HrhService.deleteHrh(Number(id));
    res.json({ message: 'Horário excluído com sucesso' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Reservar horário
 * POST /api/hrh/:id/reserve
 */
export async function reserveHrh(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const clienteId = req.user!.id;

    const hrh = await HrhService.reserveHrh(Number(id), clienteId);
    res.json(hrh);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Cancelar reserva
 * POST /api/hrh/:id/cancel
 */
export async function cancelReserveHrh(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const hrh = await HrhService.getHrhById(Number(id));

    // Verificar permissão
    if (req.user!.role !== 'ADMIN' && hrh.clienteId !== req.user!.id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const updated = await HrhService.cancelReserveHrh(Number(id));
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Buscar horários disponíveis
 * GET /api/hrh/available
 */
export async function getAvailableHrh(req: AuthenticatedRequest, res: Response) {
  try {
    const { professorId } = req.query;

    if (professorId) {
      const hrhs = await HrhService.getAvailableHrhByProfessor(Number(professorId));
      res.json(hrhs);
    } else {
      // Listar todos disponíveis
      const hrhs = await HrhService.listHrh({ status: HrhStatus.AVAILABLE });
      res.json(hrhs);
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Buscar agenda do professor logado
 * GET /api/hrh/agenda
 */
export async function getProfessorAgenda(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'PROFESSOR' && req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const agenda = await HrhService.getProfessorAgenda(req.user!.id);
    res.json(agenda);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Resetar horários expirados (admin only)
 * POST /api/hrh/reset-expired
 */
export async function resetExpiredHrh(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const results = await HrhService.resetExpiredHrh();
    res.json({ message: 'Horários expirados processados', results });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
