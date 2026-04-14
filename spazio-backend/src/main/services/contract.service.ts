// src/main/services/contract.service.ts
import { prisma } from '../prisma';

/**
 * Tipos de entrada para Contract
 */
export interface CreateContractInput {
  clienteId: number;
  horasTotais: number;
  dataFim?: Date;
}

export interface UpdateContractInput {
  horasTotais?: number;
  horasUsadas?: number;
  horasDisponiveis?: number;
  status?: string;
  dataFim?: Date;
}

/**
 * Criar novo contrato
 * Usado pelo admin ao vender um plano
 */
export async function createContract(data: CreateContractInput) {
  return await prisma.contract.create({
    data: {
      clienteId: data.clienteId,
      horasTotais: data.horasTotais,
      horasUsadas: 0,
      horasDisponiveis: data.horasTotais,
      dataFim: data.dataFim,
      status: 'ACTIVE',
    },
    include: {
      cliente: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });
}

/**
 * Listar todos os contratos com filtros
 */
export async function listContracts(filters: {
  clienteId?: number;
  status?: string;
}) {
  const where: any = {};

  if (filters.clienteId) {
    where.clienteId = filters.clienteId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.contract.findMany({
    where,
    include: {
      cliente: {
        select: { id: true, name: true, email: true, phone: true },
      },
      pagamentos: {
        where: { status: 'APPROVED' },
        orderBy: { dataPagamento: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Buscar contrato por ID
 */
export async function getContractById(id: number) {
  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      cliente: {
        select: { id: true, name: true, email: true, phone: true },
      },
      pagamentos: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!contract) {
    throw new Error('Contrato não encontrado');
  }

  return contract;
}

/**
 * Buscar contrato ativo do cliente
 */
export async function getActiveContractByClient(clienteId: number) {
  return await prisma.contract.findFirst({
    where: {
      clienteId,
      status: 'ACTIVE',
      horasDisponiveis: { gt: 0 },
    },
    include: {
      cliente: {
        select: { id: true, name: true, email: true, phone: true },
      },
      pagamentos: {
        where: { status: 'APPROVED' },
        orderBy: { dataPagamento: 'desc' },
      },
    },
    orderBy: { dataFim: 'desc' },
  });
}

/**
 * Atualizar contrato
 */
export async function updateContract(id: number, data: UpdateContractInput) {
  const contract = await prisma.contract.update({
    where: { id },
    data,
    include: {
      cliente: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  return contract;
}

/**
 * Cancelar contrato
 */
export async function cancelContract(id: number) {
  return await prisma.contract.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });
}

/**
 * Adicionar horas ao contrato
 * Usado quando o cliente compra mais horas
 */
export async function addHoursToContract(id: number, horas: number) {
  const contract = await prisma.contract.findUnique({
    where: { id },
  });

  if (!contract) {
    throw new Error('Contrato não encontrado');
  }

  if (contract.status !== 'ACTIVE') {
    throw new Error('Contrato não está ativo');
  }

  return await prisma.contract.update({
    where: { id },
    data: {
      horasTotais: contract.horasTotais + horas,
      horasDisponiveis: contract.horasDisponiveis + horas,
    },
  });
}

/**
 * Dashboard - Estatísticas para Admin
 */
export async function getAdminDashboard() {
  // Total de horas usadas
  const totalHorasUsadas = await prisma.contract.aggregate({
    _sum: { horasUsadas: true },
  });

  // Total de horas disponíveis
  const totalHorasDisponiveis = await prisma.contract.aggregate({
    _sum: { horasDisponiveis: true },
  });

  // Total de professores ativos
  const totalProfessores = await prisma.user.count({
    where: { role: 'PROFESSOR' },
  });

  // Total de clientes ativos (com contratos ativos)
  const totalClientes = await prisma.contract.count({
    where: { status: 'ACTIVE' },
  });

  // Lista de contratos ativos para detalhe
  const contratosAtivos = await prisma.contract.findMany({
    where: { status: 'ACTIVE' },
    include: {
      cliente: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { horasDisponiveis: 'desc' },
    take: 10,
  });

  return {
    totalHorasUsadas: totalHorasUsadas._sum.horasUsadas || 0,
    totalHorasDisponiveis: totalHorasDisponiveis._sum.horasDisponiveis || 0,
    totalProfessores,
    totalClientes,
    contratosAtivos,
  };
}

/**
 * Buscar todos os professores
 */
export async function getAllProfessores() {
  return await prisma.user.findMany({
    where: { role: 'PROFESSOR' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Buscar todos os clientes
 */
export async function getAllClientes() {
  return await prisma.user.findMany({
    where: { role: 'USER' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });
}
