// src/main/controllers/payment.controller.ts
import { Response, Request } from 'express';
import * as PaymentService from '../services/payment.service';
import * as ContractService from '../services/contract.service';
import { AuthenticatedRequest } from '../types';
import { PaymentStatus } from '@prisma/client';

/**
 * Criar pagamento
 * POST /api/payments
 */
export async function createPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { contractId, valor, plano, metodoPagamento } = req.body;

    if (!contractId || !valor || !plano) {
      res.status(400).json({ error: 'Dados incompletos' });
      return;
    }

    const payment = await PaymentService.processPayment(
      contractId,
      valor,
      plano,
      metodoPagamento || 'PIX'
    );

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Listar pagamentos
 * GET /api/payments
 */
export async function listPayments(req: AuthenticatedRequest, res: Response) {
  try {
    const { contractId, status } = req.query;

    const filters: any = {};

    if (contractId) filters.contractId = Number(contractId);
    if (status) filters.status = status as PaymentStatus;

    // Se for cliente, só mostra seus pagamentos
    if (req.user!.role === 'USER') {
      const contract = await ContractService.getActiveContractByClient(req.user!.id);
      if (contract) {
        filters.contractId = contract.id;
      }
    }

    const payments = await PaymentService.listPayments(filters);
    res.json(payments);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Buscar pagamento por ID
 * GET /api/payments/:id
 */
export async function getPaymentById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const payment = await PaymentService.getPaymentById(Number(id));
    res.json(payment);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * Aprovar pagamento (admin only)
 * POST /api/payments/:id/approve
 */
export async function approvePayment(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const { id } = req.params;
    const { transacaoId } = req.body;

    const payment = await PaymentService.approvePayment(Number(id), transacaoId);
    res.json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Rejeitar pagamento (admin only)
 * POST /api/payments/:id/reject
 */
export async function rejectPayment(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const { id } = req.params;
    const payment = await PaymentService.rejectPayment(Number(id));
    res.json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Estornar pagamento (admin only)
 * POST /api/payments/:id/refund
 */
export async function refundPayment(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const { id } = req.params;
    const payment = await PaymentService.refundPayment(Number(id));
    res.json(payment);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Dashboard de pagamentos (admin only)
 * GET /api/payments/dashboard
 */
export async function getPaymentDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const dashboard = await PaymentService.getPaymentDashboard();
    res.json(dashboard);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
