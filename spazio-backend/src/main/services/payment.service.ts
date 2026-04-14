// src/main/services/payment.service.ts
import { prisma } from '../prisma';
import { PaymentStatus } from '@prisma/client';

/**
 * Tipos de entrada para Payment
 */
export interface CreatePaymentInput {
  contractId: number;
  valor: number;
  plano: string;
  dataVencimento: Date;
  metodoPagamento?: string;
}

/**
 * Criar pagamento
 */
export async function createPayment(data: CreatePaymentInput) {
  return await prisma.payment.create({
    data: {
      contractId: data.contractId,
      valor: data.valor,
      plano: data.plano,
      dataVencimento: data.dataVencimento,
      metodoPagamento: data.metodoPagamento,
      status: PaymentStatus.PENDING,
    },
    include: {
      contract: {
        include: {
          cliente: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
}

/**
 * Listar pagamentos com filtros
 */
export async function listPayments(filters: {
  contractId?: number;
  status?: PaymentStatus;
}) {
  const where: any = {};

  if (filters.contractId) {
    where.contractId = filters.contractId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.payment.findMany({
    where,
    include: {
      contract: {
        include: {
          cliente: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Buscar pagamento por ID
 */
export async function getPaymentById(id: number) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      contract: {
        include: {
          cliente: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new Error('Pagamento não encontrado');
  }

  return payment;
}

/**
 * Aprovar pagamento
 * Ao aprovar, adicionar horas ao contrato
 */
export async function approvePayment(id: number, transacaoId?: string) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { contract: true },
  });

  if (!payment) {
    throw new Error('Pagamento não encontrado');
  }

  if (payment.status !== PaymentStatus.PENDING) {
    throw new Error('Pagamento não está pendente');
  }

  // Atualizar status do pagamento
  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: {
      status: PaymentStatus.APPROVED,
      dataPagamento: new Date(),
      transacaoId,
    },
  });

  // Adicionar horas ao contrato
  const planoHoras = getPlanoHoras(payment.plano);
  await prisma.contract.update({
    where: { id: payment.contractId },
    data: {
      horasTotais: payment.contract.horasTotais + planoHoras,
      horasDisponiveis: payment.contract.horasDisponiveis + planoHoras,
    },
  });

  return updatedPayment;
}

/**
 * Rejeitar pagamento
 */
export async function rejectPayment(id: number) {
  return await prisma.payment.update({
    where: { id },
    data: { status: PaymentStatus.REJECTED },
  });
}

/**
 * Estornar pagamento
 */
export async function refundPayment(id: number) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { contract: true },
  });

  if (!payment) {
    throw new Error('Pagamento não encontrado');
  }

  // Atualizar status do pagamento
  const updatedPayment = await prisma.payment.update({
    where: { id },
    data: { status: PaymentStatus.REFUNDED },
  });

  // Remover horas do contrato
  const planoHoras = getPlanoHoras(payment.plano);
  await prisma.contract.update({
    where: { id: payment.contractId },
    data: {
      horasTotais: Math.max(0, payment.contract.horasTotais - planoHoras),
      horasDisponiveis: Math.max(0, payment.contract.horasDisponiveis - planoHoras),
    },
  });

  return updatedPayment;
}

/**
 * Mapear nome do plano para horas
 */
function getPlanoHoras(plano: string): number {
  const planoMap: Record<string, number> = {
    'basico': 4,
    'básico': 4,
    'intermediario': 8,
    'intermediário': 8,
    'premium': 12,
  };

  return planoMap[plano.toLowerCase()] || 4;
}

/**
 * Criar pagamento via gateway (simulado)
 * Em produção, isso integraria com Mercado Pago, Stripe, etc.
 */
export async function processPayment(
  contractId: number,
  valor: number,
  plano: string,
  metodoPagamento: 'PIX' | 'CARD' | 'BOLETO'
) {
  const dataVencimento = new Date();
  dataVencimento.setDate(dataVencimento.getDate() + 7); // Vencimento em 7 dias

  const payment = await createPayment({
    contractId,
    valor,
    plano,
    dataVencimento,
    metodoPagamento,
  });

  // Simular processamento (em produção, chamar API do gateway)
  // Aqui vamos aprovar automaticamente para demo
  // Em produção, aguardaria webhook do gateway
  const transacaoId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  await approvePayment(payment.id, transacaoId);

  return payment;
}

/**
 * Dashboard de pagamentos
 */
export async function getPaymentDashboard() {
  const pagamentosAprovados = await prisma.payment.aggregate({
    where: { status: PaymentStatus.APPROVED },
    _sum: { valor: true },
    _count: true,
  });

  const pagamentosPendentes = await prisma.payment.count({
    where: { status: PaymentStatus.PENDING },
  });

  const pagamentosPorPlano = await prisma.payment.groupBy({
    by: ['plano'],
    where: { status: PaymentStatus.APPROVED },
    _sum: { valor: true },
    _count: true,
  });

  return {
    totalRecebido: pagamentosAprovados._sum.valor || 0,
    totalTransacoes: pagamentosAprovados._count,
    pendentes: pagamentosPendentes,
    porPlano: pagamentosPorPlano,
  };
}
