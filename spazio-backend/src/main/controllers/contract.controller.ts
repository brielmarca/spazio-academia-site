// src/main/controllers/contract.controller.ts
import { Response, Request } from 'express';
import * as ContractService from '../services/contract.service';
import { AuthenticatedRequest } from '../types';

/**
 * Criar novo contrato
 * POST /api/contracts
 */
export async function createContract(req: AuthenticatedRequest, res: Response) {
  try {
    const { clienteId, horasTotais, dataFim } = req.body;

    // Apenas admin pode criar contratos
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    if (!clienteId || !horasTotais) {
      res.status(400).json({ error: 'Cliente e horas são obrigatórios' });
      return;
    }

    const contract = await ContractService.createContract({
      clienteId,
      horasTotais,
      dataFim: dataFim ? new Date(dataFim) : undefined,
    });

    res.status(201).json(contract);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Listar contratos
 * GET /api/contracts
 */
export async function listContracts(req: AuthenticatedRequest, res: Response) {
  try {
    const { clienteId, status } = req.query;

    const filters: any = {};

    if (clienteId) filters.clienteId = Number(clienteId);
    if (status) filters.status = status;

    const contracts = await ContractService.listContracts(filters);
    res.json(contracts);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Buscar contrato por ID
 * GET /api/contracts/:id
 */
export async function getContractById(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const contract = await ContractService.getContractById(Number(id));
    res.json(contract);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * Buscar contrato ativo do cliente logado
 * GET /api/contracts/active
 */
export async function getActiveContract(req: AuthenticatedRequest, res: Response) {
  try {
    const clienteId = req.user!.id;
    const contract = await ContractService.getActiveContractByClient(clienteId);
    
    if (!contract) {
      res.status(404).json({ error: 'Nenhum contrato ativo encontrado' });
      return;
    }

    res.json(contract);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
}

/**
 * Atualizar contrato
 * PUT /api/contracts/:id
 */
export async function updateContract(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { horasTotais, dataFim, status } = req.body;

    // Apenas admin pode atualizar
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const updated = await ContractService.updateContract(Number(id), {
      horasTotais,
      dataFim: dataFim ? new Date(dataFim) : undefined,
      status,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Cancelar contrato
 * POST /api/contracts/:id/cancel
 */
export async function cancelContract(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    // Apenas admin pode cancelar
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const contract = await ContractService.cancelContract(Number(id));
    res.json(contract);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Adicionar horas ao contrato
 * POST /api/contracts/:id/add-hours
 */
export async function addHours(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { horas } = req.body;

    if (!horas || horas <= 0) {
      res.status(400).json({ error: 'Quantidade de horas inválida' });
      return;
    }

    // Apenas admin pode adicionar horas
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const contract = await ContractService.addHoursToContract(Number(id), horas);
    res.json(contract);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Dashboard Admin
 * GET /api/contracts/dashboard
 */
export async function getDashboard(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const dashboard = await ContractService.getAdminDashboard();
    res.json(dashboard);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Listar professores
 * GET /api/contracts/professores
 */
export async function getProfessores(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const professores = await ContractService.getAllProfessores();
    res.json(professores);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

/**
 * Listar clientes
 * GET /api/contracts/clientes
 */
export async function getClientes(req: AuthenticatedRequest, res: Response) {
  try {
    if (req.user!.role !== 'ADMIN') {
      res.status(403).json({ error: 'Acesso restrito a administradores' });
      return;
    }

    const clientes = await ContractService.getAllClientes();
    res.json(clientes);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
