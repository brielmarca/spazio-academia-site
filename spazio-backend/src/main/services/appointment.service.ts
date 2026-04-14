// src/main/services/appointment.service.ts
import { prisma } from '../prisma';
import { getActiveSubscription } from './subscription.service';

export interface CreateAppointmentInput {
  userId: number;
  trainerId: number;
  date: Date;
  notes?: string;
}

export async function createAppointment(data: CreateAppointmentInput) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  const hasActiveSubscription = await checkUserActiveSubscription(data.userId);
  if (!hasActiveSubscription) {
    throw new Error('Você precisa de uma assinatura ativa para agendar');
  }

  const trainer = await prisma.trainer.findUnique({
    where: { id: data.trainerId },
  });

  if (!trainer) {
    throw new Error('Professor não encontrado');
  }

  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      trainerId: data.trainerId,
      date: data.date,
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  if (existingAppointment) {
    throw new Error('Este horário já está reservado');
  }

  const appointment = await prisma.appointment.create({
    data: {
      userId: data.userId,
      trainerId: data.trainerId,
      date: data.date,
      notes: data.notes,
      status: 'CONFIRMED',
    },
    include: {
      trainer: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return appointment;
}

export async function getUserAppointments(userId: number) {
  const appointments = await prisma.appointment.findMany({
    where: { userId },
    include: {
      trainer: true,
    },
    orderBy: { date: 'desc' },
  });
  return appointments;
}

export async function getTrainerAppointments(trainerId: number) {
  const appointments = await prisma.appointment.findMany({
    where: { trainerId },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
    orderBy: { date: 'asc' },
  });
  return appointments;
}

export async function getAppointmentById(id: number) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      trainer: true,
      user: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!appointment) {
    throw new Error('Agendamento não encontrado');
  }

  return appointment;
}

export async function cancelAppointment(id: number, userId: number) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
  });

  if (!appointment) {
    throw new Error('Agendamento não encontrado');
  }

  if (appointment.userId !== userId) {
    throw new Error('Você não tem permissão para cancelar este agendamento');
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: { status: 'CANCELED' },
  });

  return updatedAppointment;
}

export async function completeAppointment(id: number) {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: 'COMPLETED' },
  });
  return appointment;
}

async function checkUserActiveSubscription(userId: number): Promise<boolean> {
  try {
    const subscription = await getActiveSubscription(userId);
    return !!subscription;
  } catch {
    return false;
  }
}

export async function getUpcomingAppointments(userId: number) {
  const now = new Date();
  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      date: { gte: now },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
    include: {
      trainer: true,
    },
    orderBy: { date: 'asc' },
    take: 5,
  });
  return appointments;
}
