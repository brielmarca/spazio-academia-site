// src/services/payment.ts - Serviço para Pagamentos
import { apiRequest } from './api';

export interface Payment {
  id: number;
  contractId: number;
  valor: number;
  plano: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  dataPagamento: string | null;
  dataVencimento: string;
  metodoPagamento: string | null;
  transacaoId: string | null;
  contract: {
    id: number;
    cliente: { id: number; name: string; email: string };
  };
}

export interface CreatePaymentInput {
  contractId: number;
  valor: number;
  plano: string;
  metodoPagamento?: 'PIX' | 'CARD' | 'BOLETO';
}

// Dashboard de pagamentos
export async function getPaymentDashboard() {
  return apiRequest('/payments/dashboard');
}

// Listar pagamentos
export async function listPayments(filters?: { contractId?: number; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.contractId) params.append('contractId', filters.contractId.toString());
  if (filters?.status) params.append('status', filters.status);
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/payments${query}`);
}

// Buscar pagamento por ID
export async function getPaymentById(id: number) {
  return apiRequest(`/payments/${id}`);
}

// Criar pagamento
export async function createPayment(data: CreatePaymentInput) {
  return apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Aprovar pagamento (admin)
export async function approvePayment(id: number, transacaoId?: string) {
  return apiRequest(`/payments/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ transacaoId }),
  });
}

// Rejeitar pagamento (admin)
export async function rejectPayment(id: number) {
  return apiRequest(`/payments/${id}/reject`, {
    method: 'POST',
  });
}

// Estornar pagamento (admin)
export async function refundPayment(id: number) {
  return apiRequest(`/payments/${id}/refund`, {
    method: 'POST',
  });
}

export const paymentService = {
  getPaymentDashboard,
  listPayments,
  getPaymentById,
  createPayment,
  approvePayment,
  rejectPayment,
  refundPayment,
};

export default paymentService;
