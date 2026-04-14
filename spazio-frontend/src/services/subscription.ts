// src/services/subscription.ts
import { apiRequest } from './api';

export interface Plan {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  price: number;
  abacatepayPlanId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  planId: number;
  abacatepayCustomerId?: string;
  abacatepaySubscriptionId?: string;
  status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateSubscriptionResponse {
  subscription: Subscription;
  checkoutUrl: string;
  paymentUrl: string;
}

/**
 * Listar todos os planos disponíveis
 */
export async function getPlans(): Promise<{ plans: Plan[] }> {
  return apiRequest('/plans');
}

/**
 * Buscar plano por ID
 */
export async function getPlanById(id: number): Promise<{ plan: Plan }> {
  return apiRequest(`/plans/${id}`);
}

/**
 * Criar nova assinatura
 */
export async function createSubscription(planId: number): Promise<CreateSubscriptionResponse> {
  return apiRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ planId }),
  });
}

/**
 * Listar minhas assinaturas
 */
export async function getMySubscriptions(): Promise<{ subscriptions: Subscription[] }> {
  return apiRequest('/subscriptions/my');
}

/**
 * Buscar assinatura ativa
 */
export async function getActiveSubscription(): Promise<{ subscription: Subscription }> {
  return apiRequest('/subscriptions/active');
}

/**
 * Verificar se tenho assinatura ativa
 */
export async function checkActiveSubscription(): Promise<{
  hasActiveSubscription: boolean;
  subscription: Subscription | null;
}> {
  return apiRequest('/subscriptions/check');
}

/**
 * Cancelar assinatura
 */
export async function cancelSubscription(
  subscriptionId: number,
  cancelAtPeriodEnd = true
): Promise<{ subscription: Subscription; message: string }> {
  return apiRequest(`/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ cancelAtPeriodEnd }),
  });
}

/**
 * Buscar assinatura por ID
 */
export async function getSubscriptionById(id: number): Promise<{ subscription: Subscription }> {
  return apiRequest(`/subscriptions/${id}`);
}

/**
 * Formatar preço
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price / 100);
}

/**
 * Obter label do status
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    ACTIVE: 'Ativa',
    PAST_DUE: 'Atrasada',
    CANCELED: 'Cancelada',
    EXPIRED: 'Expirada',
  };
  return labels[status] || status;
}

/**
 * Obter cor do status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500',
    ACTIVE: 'bg-green-500',
    PAST_DUE: 'bg-red-500',
    CANCELED: 'bg-gray-500',
    EXPIRED: 'bg-gray-400',
  };
  return colors[status] || 'bg-gray-500';
}
