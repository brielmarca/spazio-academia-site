// src/services/hrh.ts - Serviço para HRH (horários)
import { apiRequest } from './api';

export interface Hrh {
  id: number;
  professorId: number;
  dataHora: string;
  duracao: number;
  status: 'AVAILABLE' | 'RESERVED' | 'COMPLETED' | 'CANCELLED';
  clienteId: number | null;
  professor: { id: number; name: string; email: string };
  cliente?: { id: number; name: string; email: string };
}

export interface CreateHrhInput {
  dataHora: string;
  duracao?: number;
}

// Listar horários
export async function listHrh(filters?: { professorId?: number; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.professorId) params.append('professorId', filters.professorId.toString());
  if (filters?.status) params.append('status', filters.status);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/hrh${query}`);
}

// Buscar horários disponíveis
export async function getAvailableHrh(professorId?: number) {
  const query = professorId ? `?professorId=${professorId}` : '';
  return apiRequest(`/hrh/available${query}`);
}

// Buscar agenda do professor
export async function getProfessorAgenda() {
  return apiRequest('/hrh/agenda');
}

// Criar horário
export async function createHrh(data: CreateHrhInput) {
  return apiRequest('/hrh', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Atualizar horário
export async function updateHrh(id: number, data: Partial<CreateHrhInput & { status: string }>) {
  return apiRequest(`/hrh/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Excluir horário
export async function deleteHrh(id: number) {
  return apiRequest(`/hrh/${id}`, {
    method: 'DELETE',
  });
}

// Reservar horário
export async function reserveHrh(id: number) {
  return apiRequest(`/hrh/${id}/reserve`, {
    method: 'POST',
  });
}

// Cancelar reserva
export async function cancelReserveHrh(id: number) {
  return apiRequest(`/hrh/${id}/cancel`, {
    method: 'POST',
  });
}

// Resetar horários expirados (admin)
export async function resetExpiredHrh() {
  return apiRequest('/hrh/reset-expired', {
    method: 'POST',
  });
}

export const hrhService = {
  listHrh,
  getAvailableHrh,
  getProfessorAgenda,
  createHrh,
  updateHrh,
  deleteHrh,
  reserveHrh,
  cancelReserveHrh,
  resetExpiredHrh,
};

export default hrhService;
