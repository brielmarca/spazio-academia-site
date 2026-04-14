// src/services/contract.ts - Serviço para Contratos
import { apiRequest } from './api';

export interface Contract {
  id: number;
  clienteId: number;
  horasTotais: number;
  horasUsadas: number;
  horasDisponiveis: number;
  status: string;
  dataInicio: string;
  dataFim: string | null;
  cliente: { id: number; name: string; email: string; phone: string };
  pagamentos: Payment[];
}

export interface Payment {
  id: number;
  contractId: number;
  valor: number;
  plano: string;
  status: string;
  dataPagamento: string | null;
  dataVencimento: string;
  metodoPagamento: string | null;
  transacaoId: string | null;
}

export interface CreateContractInput {
  clienteId: number;
  horasTotais: number;
  dataFim?: string;
}

// Dashboard admin
export async function getDashboard() {
  return apiRequest('/contracts/dashboard');
}

// Listar professores
export async function getProfessores() {
  return apiRequest('/contracts/professores');
}

// Listar clientes
export async function getClientes() {
  return apiRequest('/contracts/clientes');
}

// Listar contratos
export async function listContracts(filters?: { clienteId?: number; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.clienteId) params.append('clienteId', filters.clienteId.toString());
  if (filters?.status) params.append('status', filters.status);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/contracts${query}`);
}

// Buscar contrato por ID
export async function getContractById(id: number) {
  return apiRequest(`/contracts/${id}`);
}

// Buscar contrato ativo do cliente
export async function getActiveContract() {
  return apiRequest('/contracts/active');
}

// Criar contrato
export async function createContract(data: CreateContractInput) {
  return apiRequest('/contracts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Atualizar contrato
export async function updateContract(id: number, data: Partial<CreateContractInput & { status: string }>) {
  return apiRequest(`/contracts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Cancelar contrato
export async function cancelContract(id: number) {
  return apiRequest(`/contracts/${id}/cancel`, {
    method: 'POST',
  });
}

// Adicionar horas
export async function addHours(id: number, horas: number) {
  return apiRequest(`/contracts/${id}/add-hours`, {
    method: 'POST',
    body: JSON.stringify({ horas }),
  });
}

export const contractService = {
  getDashboard,
  getProfessores,
  getClientes,
  listContracts,
  getContractById,
  getActiveContract,
  createContract,
  updateContract,
  cancelContract,
  addHours,
};

export default contractService;
