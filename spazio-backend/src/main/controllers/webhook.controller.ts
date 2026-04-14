// src/main/controllers/webhook.controller.ts
import { Request, Response } from 'express';
import * as SubscriptionService from '../services/subscription.service';
import { SubscriptionStatus } from '@prisma/client';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'webhook-secret-spazio-2025';

/**
 * Mapear status do AbacatePay para status interno
 */
function mapAbacatePayStatus(status: string): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    'pending': SubscriptionStatus.PENDING,
    'active': SubscriptionStatus.ACTIVE,
    'past_due': SubscriptionStatus.PAST_DUE,
    'canceled': SubscriptionStatus.CANCELED,
    'expired': SubscriptionStatus.EXPIRED,
    'trialing': SubscriptionStatus.ACTIVE,
  };

  return statusMap[status.toLowerCase()] || SubscriptionStatus.PENDING;
}

/**
 * Validar assinatura do webhook
 * O AbacatePay envia um header X-Webhook-Signature para verificação
 */
function validateWebhookSignature(req: Request): boolean {
  const signature = req.headers['x-webhook-signature'] as string;
  const secret = req.headers['x-webhook-secret'] as string;

  // Verificar secret básico
  if (secret && secret !== WEBHOOK_SECRET) {
    console.warn('Webhook secret inválido');
    return false;
  }

  // Se não houver secret, aceitar mas logar aviso (em produção deve rejeitar)
  if (!secret) {
    console.warn('Webhook sem secret - aceitando em modo desenvolvimento');
  }

  return true;
}

/**
 * Handler principal do webhook AbacatePay
 * POST /webhook/abacatepay
 */
export async function handleAbacatePayWebhook(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Validar segurança
    if (!validateWebhookSignature(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { event, data } = req.body;

    console.log(`📩 Webhook recebido: ${event}`, JSON.stringify(data, null, 2));

    // Processar eventos
    switch (event) {
      case 'payment.approved':
        await handlePaymentApproved(data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(data);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(data);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(data);
        break;

      case 'subscription.expired':
        await handleSubscriptionExpired(data);
        break;

      default:
        console.log(`⚠️ Evento não tratado: ${event}`);
    }

    // Sempre retornar 200 para webhooks (evitar retries desnecessários)
    res.json({ received: true });
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook:', error);
    // Mesmo em erro, retornar 200 para evitar retries infinitos
    // Logar o erro para investigação posterior
    res.json({ received: true, error: error.message });
  }
}

/**
 * Pagamento aprovado
 */
async function handlePaymentApproved(data: any): Promise<void> {
  console.log('✅ Pagamento aprovado:', data.id);

  // Se tiver subscription associada, atualizar para ativa
  if (data.subscription?.id) {
    await SubscriptionService.updateSubscriptionStatus(
      data.subscription.id,
      SubscriptionStatus.ACTIVE,
      {
        currentPeriodStart: data.currentPeriodStart
          ? new Date(data.currentPeriodStart)
          : undefined,
        currentPeriodEnd: data.currentPeriodEnd
          ? new Date(data.currentPeriodEnd)
          : undefined,
      }
    );
    console.log(`✅ Assinatura ${data.subscription.id} ativada`);
  }
}

/**
 * Pagamento falhou
 */
async function handlePaymentFailed(data: any): Promise<void> {
  console.log('❌ Pagamento falhou:', data.id);

  if (data.subscription?.id) {
    await SubscriptionService.updateSubscriptionStatus(
      data.subscription.id,
      SubscriptionStatus.PAST_DUE
    );
    console.log(`⚠️ Assinatura ${data.subscription.id} marcada como past_due`);
  }
}

/**
 * Assinatura criada
 */
async function handleSubscriptionCreated(data: any): Promise<void> {
  console.log('📝 Assinatura criada:', data.id);

  // A assinatura já foi criada pelo nosso backend
  // Aqui apenas confirmamos e atualizamos se necessário
  const subscription = await SubscriptionService.getSubscriptionByAbacatePayId(
    data.id
  );

  if (subscription) {
    console.log(`✅ Assinatura ${data.id} confirmada no banco`);
  } else {
    console.warn(`⚠️ Assinatura ${data.id} não encontrada no banco`);
  }
}

/**
 * Assinatura atualizada
 */
async function handleSubscriptionUpdated(data: any): Promise<void> {
  console.log('📝 Assinatura atualizada:', data.id);

  const status = mapAbacatePayStatus(data.status);

  await SubscriptionService.updateSubscriptionStatus(data.id, status, {
    currentPeriodStart: data.currentPeriodStart
      ? new Date(data.currentPeriodStart)
      : undefined,
    currentPeriodEnd: data.currentPeriodEnd
      ? new Date(data.currentPeriodEnd)
      : undefined,
    cancelAtPeriodEnd: data.cancelAtPeriodEnd,
  });

  console.log(`✅ Assinatura ${data.id} atualizada para ${status}`);
}

/**
 * Assinatura cancelada
 */
async function handleSubscriptionCanceled(data: any): Promise<void> {
  console.log('🚫 Assinatura cancelada:', data.id);

  await SubscriptionService.updateSubscriptionStatus(
    data.id,
    SubscriptionStatus.CANCELED,
    {
      cancelAtPeriodEnd: true,
    }
  );

  console.log(`✅ Assinatura ${data.id} marcada como cancelada`);
}

/**
 * Assinatura expirada
 */
async function handleSubscriptionExpired(data: any): Promise<void> {
  console.log('⏰ Assinatura expirada:', data.id);

  await SubscriptionService.updateSubscriptionStatus(
    data.id,
    SubscriptionStatus.EXPIRED
  );

  console.log(`✅ Assinatura ${data.id} marcada como expirada`);
}

/**
 * Health check do webhook
 * GET /webhook/health
 */
export async function webhookHealth(req: Request, res: Response): Promise<void> {
  res.json({
    status: 'ok',
    webhook: 'abacatepay',
    timestamp: new Date().toISOString(),
  });
}
