// src/main/routes/contract.routes.ts
import express, { Router } from 'express';
import * as ContractController from '../controllers/contract.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Dashboard admin
router.get('/dashboard', requireAdmin, ContractController.getDashboard);

// Listar professores (admin)
router.get('/professores', requireAdmin, ContractController.getProfessores);

// Listar clientes (admin)
router.get('/clientes', requireAdmin, ContractController.getClientes);

// Contrato ativo do cliente
router.get('/active', ContractController.getActiveContract);

// Rotas de contratos
router.post('/', requireAdmin, ContractController.createContract);
router.get('/', ContractController.listContracts);
router.get('/:id', ContractController.getContractById);
router.put('/:id', requireAdmin, ContractController.updateContract);

// Ações
router.post('/:id/cancel', requireAdmin, ContractController.cancelContract);
router.post('/:id/add-hours', requireAdmin, ContractController.addHours);

export function setupContractRoutes(app: express.Application): void {
  app.use('/api/contracts', router);
}

export default router;
