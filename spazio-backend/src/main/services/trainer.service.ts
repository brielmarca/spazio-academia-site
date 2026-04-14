// src/main/services/trainer.service.ts
import { prisma } from '../prisma';

export interface CreateTrainerInput {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  specialties?: string;
}

export interface CreateAvailabilityInput {
  trainerId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export async function createTrainer(data: CreateTrainerInput) {
  const trainer = await prisma.trainer.create({
    data: {
      name: data.name,
      role: data.role,
      bio: data.bio,
      image: data.image,
      specialties: data.specialties || '',
    },
  });
  return trainer;
}

export async function getAllTrainers(includeInactive = false) {
  const trainers = await prisma.trainer.findMany({
    where: includeInactive ? undefined : { isActive: true },
    include: {
      availabilities: {
        where: { isActive: true },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      },
    },
    orderBy: { name: 'asc' },
  });
  return trainers;
}

export async function getTrainerById(id: number) {
  const trainer = await prisma.trainer.findUnique({
    where: { id },
    include: {
      availabilities: {
        where: { isActive: true },
        orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      },
    },
  });

  if (!trainer) {
    throw new Error('Professor não encontrado');
  }

  return trainer;
}

export async function updateTrainer(id: number, data: Partial<CreateTrainerInput>) {
  const trainer = await prisma.trainer.update({
    where: { id },
    data,
  });
  return trainer;
}

export async function deactivateTrainer(id: number) {
  const trainer = await prisma.trainer.update({
    where: { id },
    data: { isActive: false },
  });
  return trainer;
}

export async function createAvailability(data: CreateAvailabilityInput) {
  const availability = await prisma.availability.create({
    data: {
      trainerId: data.trainerId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });
  return availability;
}

export async function getTrainerAvailabilities(trainerId: number) {
  const availabilities = await prisma.availability.findMany({
    where: { trainerId, isActive: true },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
  return availabilities;
}

export async function deleteAvailability(id: number) {
  await prisma.availability.update({
    where: { id },
    data: { isActive: false },
  });
  return { message: 'Disponibilidade removida com sucesso' };
}

export async function getAvailableSlots(trainerId: number, date: Date) {
  const dayOfWeek = date.getDay();

  const availabilities = await prisma.availability.findMany({
    where: { trainerId, dayOfWeek, isActive: true },
  });

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      trainerId,
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      status: { in: ['PENDING', 'CONFIRMED'] },
    },
  });

  const bookedTimes = existingAppointments.map((apt) => {
    const hours = apt.date.getHours().toString().padStart(2, '0');
    const minutes = apt.date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const slots: { time: string; available: boolean }[] = [];

  for (const availability of availabilities) {
    const [startHour, startMin] = availability.startTime.split(':').map(Number);
    const [endHour, endMin] = availability.endTime.split(':').map(Number);

    let currentTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    while (currentTime < endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      slots.push({
        time: timeStr,
        available: !bookedTimes.includes(timeStr),
      });

      currentTime += 60;
    }
  }

  return slots;
}

export async function seedDefaultTrainers() {
  const trainers = [
    {
      name: 'Rafael Mendes',
      role: 'Musculação & Funcional',
      bio: 'Professor certificado com 8 anos de experiência em musculação e treino funcional.',
      specialties: 'musculacao,funcional',
    },
    {
      name: 'Camila Torres',
      role: 'Pilates & Reabilitação',
      bio: 'Especialista em Pilates Clínico com formação em reabilitação física.',
      specialties: 'pilates',
    },
    {
      name: 'Lucas Ferreira',
      role: 'Ioga & Meditação',
      bio: 'Instrutor de Ioga com certificação internacional em Hatha e Vinyasa.',
      specialties: 'funcional',
    },
  ];

  for (const trainerData of trainers) {
    const existing = await prisma.trainer.findFirst({
      where: { name: trainerData.name },
    });

    let trainer;
    if (existing) {
      trainer = await prisma.trainer.update({
        where: { id: existing.id },
        data: trainerData,
      });
      console.log(`✅ Professor "${trainerData.name}" atualizado`);
    } else {
      trainer = await prisma.trainer.create({
        data: trainerData,
      });
      console.log(`✅ Professor "${trainerData.name}" criado`);

      const availabilities = [
        { dayOfWeek: 1, startTime: '07:00', endTime: '12:00' },
        { dayOfWeek: 1, startTime: '14:00', endTime: '21:00' },
        { dayOfWeek: 2, startTime: '07:00', endTime: '12:00' },
        { dayOfWeek: 2, startTime: '14:00', endTime: '21:00' },
        { dayOfWeek: 3, startTime: '07:00', endTime: '12:00' },
        { dayOfWeek: 3, startTime: '14:00', endTime: '21:00' },
        { dayOfWeek: 4, startTime: '07:00', endTime: '12:00' },
        { dayOfWeek: 4, startTime: '14:00', endTime: '21:00' },
        { dayOfWeek: 5, startTime: '07:00', endTime: '12:00' },
        { dayOfWeek: 5, startTime: '14:00', endTime: '21:00' },
        { dayOfWeek: 6, startTime: '10:00', endTime: '13:00' },
      ];

      for (const avail of availabilities) {
        await prisma.availability.create({
          data: { trainerId: trainer.id, ...avail },
        });
      }
      console.log(`   → Disponibilidades criadas`);
    }
  }

  console.log('✅ Seed de professores concluído');
}
