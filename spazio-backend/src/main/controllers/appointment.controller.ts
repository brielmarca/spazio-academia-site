// src/main/controllers/appointment.controller.ts
import { Request, Response } from 'express';
import * as AppointmentService from '../services/appointment.service';
import { verifyToken, getUserById } from '../services/auth.service';

/**
 * Criar agendamento
 * POST /api/appointments
 */
export async function createAppointment(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Token de autenticação não encontrado' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }

    const user = await getUserById(payload.id);
    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }

    const { trainerId, date, notes } = req.body;

    if (!trainerId || !date) {
      res.status(400).json({ error: 'Professor e data são obrigatórios' });
      return;
    }

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      res.status(400).json({ error: 'Data inválida' });
      return;
    }

    if (appointmentDate < new Date()) {
      res.status(400).json({ error: 'Não é possível agendar para uma data passada' });
      return;
    }

    const appointment = await AppointmentService.createAppointment({
      userId: user.id,
      trainerId,
      date: appointmentDate,
      notes,
    });

    res.status(201).json({ appointment });
  } catch (error: any) {
    console.error('Erro ao criar agendamento:', error);
    res.status(400).json({ error: error.message || 'Erro ao criar agendamento' });
  }
}

/**
 * Listar meus agendamentos
 * GET /api/appointments/my
 */
export async function getMyAppointments(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Token de autenticação não encontrado' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }

    const appointments = await AppointmentService.getUserAppointments(payload.id);
    res.json({ appointments });
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ error: error.message || 'Erro ao buscar agendamentos' });
  }
}

/**
 * Buscar agendamento por ID
 * GET /api/appointments/:id
 */
export async function getAppointmentById(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id as string);
    const appointment = await AppointmentService.getAppointmentById(id);
    res.json({ appointment });
  } catch (error: any) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(error.message === 'Agendamento não encontrado' ? 404 : 500).json({
      error: error.message || 'Erro ao buscar agendamento',
    });
  }
}

/**
 * Cancelar agendamento
 * POST /api/appointments/:id/cancel
 */
export async function cancelAppointment(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Token de autenticação não encontrado' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }

    const id = parseInt(req.params.id as string);
    const appointment = await AppointmentService.cancelAppointment(id, payload.id);
    res.json({ appointment, message: 'Agendamento cancelado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(400).json({ error: error.message || 'Erro ao cancelar agendamento' });
  }
}

/**
 * Listar agendamentos do professor (Admin only)
 * GET /api/appointments/trainer/:trainerId
 */
export async function getTrainerAppointments(req: Request, res: Response): Promise<void> {
  try {
    const trainerId = parseInt(req.params.trainerId as string);
    const appointments = await AppointmentService.getTrainerAppointments(trainerId);
    res.json({ appointments });
  } catch (error: any) {
    console.error('Erro ao buscar agendamentos do professor:', error);
    res.status(500).json({ error: error.message || 'Erro ao buscar agendamentos' });
  }
}

/**
 * Obter próximos agendamentos
 * GET /api/appointments/upcoming
 */
export async function getUpcomingAppointments(req: Request, res: Response): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Token de autenticação não encontrado' });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Token inválido ou expirado' });
      return;
    }

    const appointments = await AppointmentService.getUpcomingAppointments(payload.id);
    res.json({ appointments });
  } catch (error: any) {
    console.error('Erro ao buscar próximos agendamentos:', error);
    res.status(500).json({ error: error.message || 'Erro ao buscar agendamentos' });
  }
}
