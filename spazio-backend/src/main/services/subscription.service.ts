// src/main/services/subscription.service.ts
import { prisma } from '../prisma';
import { CreateSubscriptionInput } from '../types';
import { SubscriptionStatus, Plan, User } from '@prisma/client';

const ABACATEPAY_BASE_URL = 'https://api.abacatepay.com/v1';
const ABACATEPAY_SECRET_KEY = process.env.ABACATEPAY_SECRET_KEY || '';

/**
 * Headers padrão para requisições à API do AbacatePay
 */
function getAbacatePayHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ABACATEPAY_SECRET_KEY}`,
  };
}

/**
 * Criar cliente no AbacatePay
 */
async function createAbacatePayCustomer(user: User) {
  try {
    const response = await fetch(`${ABACATEPAY_BASE_URL}/customers`, {
      method: 'POST',
      headers: getAbacatePayHeaders(),
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar cliente no AbacatePay');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro ao criar cliente no AbacatePay:', error);
    throw new Error('Falha na comunicação com o gateway de pagamento');
  }
}

/**
 * Criar assinatura no AbacatePay
 */
async function createAbacatePaySubscription(
  customerId: string,
  plan: Plan,
  user: User
) {
  try {
    const response = await fetch(`${ABACATEPAY_BASE_URL}/subscriptions`, {
      method: 'POST',
      headers: getAbacatePayHeaders(),
      body: JSON.stringify({
        customer: customerId,
        product: {
          name: plan.displayName,
          description: plan.description,
          price: plan.price,
        },
        billing: {
          frequency: 'monthly',
          interval: 1,
        },
        metadata: {
          userId: user.id.toString(),
          planId: plan.id.toString(),
          planName: plan.name,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar assinatura no AbacatePay');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro ao criar assinatura no AbacatePay:', error);
    throw new Error('Falha ao criar assinatura');
  }
}

/**
 * Criar nova assinatura
 */
export async function createSubscription(data: CreateSubscriptionInput) {
  const { userId, planId } = data;

  // Buscar usuário e plano
  const [user, plan] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.plan.findUnique({ where: { id: planId } }),
  ]);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (!plan) {
    throw new Error('Plano não encontrado');
  }

  if (!plan.isActive) {
    throw new Error('Este plano não está disponível');
  }

  // Verificar se já existe assinatura ativa
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ['PENDING', 'ACTIVE'] },
    },
  });

  if (existingSubscription) {
    throw new Error('Usuário já possui uma assinatura ativa ou pendente');
  }

  // Criar cliente no AbacatePay
  const customer = await createAbacatePayCustomer(user);

  // Criar assinatura no AbacatePay
  const abacateSubscription = await createAbacatePaySubscription(
    customer.id,
    plan,
    user
  );

  // Salvar assinatura no banco
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId,
      abacatepayCustomerId: customer.id,
      abacatepaySubscriptionId: abacateSubscription.id,
      status: SubscriptionStatus.PENDING,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      plan: true,
    },
  });

  return {
    subscription,
    checkoutUrl: abacateSubscription.checkoutUrl,
    paymentUrl: abacateSubscription.paymentUrl,
  };
}

/**
 * Buscar assinatura por ID
 */
export async function getSubscriptionById(id: number) {
  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      plan: true,
    },
  });

  if (!subscription) {
    throw new Error('Assinatura não encontrada');
  }

  return subscription;
}

/**
 * Buscar assinatura pelo ID do AbacatePay
 */
export async function getSubscriptionByAbacatePayId(abacatepaySubscriptionId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { abacatepaySubscriptionId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      plan: true,
    },
  });

  return subscription;
}

/**
 * Listar assinaturas do usuário
 */
export async function getUserSubscriptions(userId: number) {
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    include: {
      plan: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return subscriptions;
}

/**
 * Atualizar status da assinatura (usado pelo webhook)
 */
export async function updateSubscriptionStatus(
  abacatepaySubscriptionId: string,
  status: SubscriptionStatus,
  metadata?: {
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  }
) {
  // Buscar a assinatura pelo ID do AbacatePay
  const existingSub = await prisma.subscription.findFirst({
    where: { abacatepaySubscriptionId },
  });

  if (!existingSub) {
    throw new Error(`Assinatura ${abacatepaySubscriptionId} não encontrada`);
  }

  // Atualizar usando o ID interno
  const subscription = await prisma.subscription.update({
    where: { id: existingSub.id },
    data: {
      status,
      ...(metadata?.currentPeriodStart && {
        currentPeriodStart: metadata.currentPeriodStart,
      }),
      ...(metadata?.currentPeriodEnd && {
        currentPeriodEnd: metadata.currentPeriodEnd,
      }),
      ...(metadata?.cancelAtPeriodEnd !== undefined && {
        cancelAtPeriodEnd: metadata.cancelAtPeriodEnd,
      }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      plan: true,
    },
  });

  return subscription;
}

/**
 * Cancelar assinatura
 */
export async function cancelSubscription(
  subscriptionId: number,
  userId: number,
  cancelAtPeriodEnd = true
) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      userId,
    },
  });

  if (!subscription) {
    throw new Error('Assinatura não encontrada');
  }

  // Cancelar no AbacatePay
  try {
    const response = await fetch(
      `${ABACATEPAY_BASE_URL}/subscriptions/${subscription.abacatepaySubscriptionId}/cancel`,
      {
        method: 'POST',
        headers: getAbacatePayHeaders(),
        body: JSON.stringify({
          cancelAtPeriodEnd,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao cancelar assinatura');
    }
  } catch (error: any) {
    console.error('Erro ao cancelar no AbacatePay:', error);
    throw new Error('Falha ao cancelar assinatura');
  }

  // Atualizar no banco
  const updated = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: cancelAtPeriodEnd ? undefined : SubscriptionStatus.CANCELED,
      cancelAtPeriodEnd,
    },
    include: {
      plan: true,
    },
  });

  return updated;
}

/**
 * Verificar se usuário tem assinatura ativa
 */
export async function hasActiveSubscription(userId: number): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  return !!subscription;
}

/**
 * Obter assinatura ativa do usuário
 */
export async function getActiveSubscription(userId: number) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
    },
    include: {
      plan: true,
    },
  });

  return subscription;
}
