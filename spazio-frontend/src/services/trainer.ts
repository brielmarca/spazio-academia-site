// src/services/trainer.ts
import { apiRequest } from './api';

export interface Trainer {
  id: number;
  name: string;
  role: string;
  bio?: string;
  image?: string;
  specialties: string;
  isActive: boolean;
  availabilities: Availability[];
}

export interface Availability {
  id: number;
  trainerId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export async function getTrainers(): Promise<{ trainers: Trainer[] }> {
  return apiRequest('/trainers');
}

export async function getTrainerById(id: number): Promise<{ trainer: Trainer }> {
  return apiRequest(`/trainers/${id}`);
}

export async function getAvailableSlots(
  trainerId: number,
  date: string
): Promise<{ slots: TimeSlot[]; date: string }> {
  return apiRequest(`/trainers/${trainerId}/availability?date=${date}`);
}

export const dayNames = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

export const shortDayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
