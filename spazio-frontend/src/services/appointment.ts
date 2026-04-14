// src/services/appointment.ts
import { apiRequest } from './api';
import { Trainer } from './trainer';

export interface Appointment {
  id: number;
  userId: number;
  trainerId: number;
  date: string;
  duration: number;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
  createdAt: string;
  updatedAt: string;
  trainer: Trainer;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateAppointmentInput {
  trainerId: number;
  date: string;
  notes?: string;
}

export async function createAppointment(
  data: CreateAppointmentInput
): Promise<{ appointment: Appointment }> {
  return apiRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMyAppointments(): Promise<{ appointments: Appointment[] }> {
  return apiRequest('/appointments/my');
}

export async function getUpcomingAppointments(): Promise<{ appointments: Appointment[] }> {
  return apiRequest('/appointments/upcoming');
}

export async function getAppointmentById(id: number): Promise<{ appointment: Appointment }> {
  return apiRequest(`/appointments/${id}`);
}

export async function cancelAppointment(id: number): Promise<{ message: string }> {
  return apiRequest(`/appointments/${id}/cancel`, {
    method: 'POST',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    weekday: '2-digit',
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELED: 'Cancelado',
};

export const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  CONFIRMED: 'bg-green-500',
  COMPLETED: 'bg-blue-500',
  CANCELED: 'bg-gray-500',
};
