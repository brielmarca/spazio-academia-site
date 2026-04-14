// src/main/services/hrh.service.ts
import { prisma } from '../prisma';
import { HrhStatus, Role } from '@prisma/client';

/**
 * Tipos de entrada para HRH
 */
export interface CreateHrhInput {
  professorId: number;
  dataHora: Date;
  duracao?: number;
}

export interface UpdateHrhInput {
  dataHora?: Date;
  duracao?: number;
  status?: HrhStatus;
  clienteId?: number | null;
}

export interface HrhFilters {
  professorId?: number;
  status?: HrhStatus;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Criar um novo horário (HRH)
 * Usado pelo professor para adicionar horários disponíveis
 */
export async function createHrh(data: CreateHrhInput) {
  return await prisma.hrh.create({
    data: {
      professorId: data.professorId,
      dataHora: data.dataHora,
      duracao: data.duracao || 60,
      status: HrhStatus.AVAILABLE,
    },
    include: {
      professor: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

/**
 * Listar horários com filtros
 * Pode filtrar por professor, status e período
 */
export async function listHrh(filters: HrhFilters) {
  const where: any = {};

  if (filters.professorId) {
    where.professorId = filters.professorId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.startDate || filters.endDate) {
    where.dataHora = {};
    if (filters.startDate) {
      where.dataHora.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.dataHora.lte = filters.endDate;
    }
  }

  return await prisma.hrh.findMany({
    where,
    include: {
      professor: {
        select: { id: true, name: true, email: true },
      },
      cliente: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { dataHora: 'asc' },
  });
}

/**
 * Buscar horário por ID
 */
export async function getHrhById(id: number) {
  const hrh = await prisma.hrh.findUnique({
    where: { id },
    include: {
      professor: {
        select: { id: true, name: true, email: true },
      },
      cliente: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!hrh) {
    throw new Error('Horário não encontrado');
  }

  return hrh;
}

/**
 * Atualizar horário
 */
export async function updateHrh(id: number, data: UpdateHrhInput) {
  const hrh = await prisma.hrh.update({
    where: { id },
    data,
    include: {
      professor: {
        select: { id: true, name: true, email: true },
      },
      cliente: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return hrh;
}

/**
 * Excluir horário
 */
export async function deleteHrh(id: number) {
  await prisma.hrh.delete({
    where: { id },
  });
}

/**
 * Reservar horário
 * Usado pelo cliente para marcar uma aula
 */
export async function reserveHrh(hrhId: number, clienteId: number) {
  // Verificar se o horário está disponível
  const hrh = await prisma.hrh.findUnique({
    where: { id: hrhId },
  });

  if (!hrh) {
    throw new Error('Horário não encontrado');
  }

  if (hrh.status !== HrhStatus.AVAILABLE) {
    throw new Error('Horário não está disponível');
  }

  // Verificar se o cliente tem horas disponíveis
  const contract = await prisma.contract.findFirst({
    where: {
      clienteId,
      status: 'ACTIVE',
      horasDisponiveis: { gt: 0 },
    },
    orderBy: { dataFim: 'desc' },
  });

  if (!contract) {
    throw new Error('Você não tem horas disponíveis. Contrate um plano.');
  }

  // Atualizar status do horário
  const updatedHrh = await prisma.hrh.update({
    where: { id: hrhId },
    data: {
      status: HrhStatus.RESERVED,
      clienteId,
    },
    include: {
      professor: {
        select: { id: true, name: true, email: true },
      },
      cliente: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedHrh;
}

/**
 * Finalizar horário (quando a aula passa)
 * Deduz as horas do contrato do cliente
 */
export async function completeHrh(hrhId: number) {
  const hrh = await prisma.hrh.findUnique({
    where: { id: hrhId },
    include: {
      cliente: true,
    },
  });

  if (!hrh) {
    throw new Error('Horário não encontrado');
  }

  if (hrh.status !== HrhStatus.RESERVED) {
    throw new Error('Horário não está reservado');
  }

  // Atualizar status do horário para completo
  const updatedHrh = await prisma.hrh.update({
    where: { id: hrhId },
    data: {
      status: HrhStatus.COMPLETED,
    },
  });

  // Deduzir horas do contrato do cliente
  if (hrh.clienteId) {
    const contract = await prisma.contract.findFirst({
      where: {
        clienteId: hrh.clienteId,
        status: 'ACTIVE',
      },
    });

    if (contract) {
      const horasUsadas = Math.ceil(hrh.duracao / 60); // Converter minutos para horas
      await prisma.contract.update({
        where: { id: contract.id },
        data: {
          horasUsadas: contract.horasUsadas + horasUsadas,
          horasDisponiveis: contract.horasDisponiveis - horasUsadas,
        },
      });
    }
  }

  return updatedHrh;
}

/**
 * Cancelar reserva
 */
export async function cancelReserveHrh(hrhId: number) {
  const hrh = await prisma.hrh.findUnique({
    where: { id: hrhId },
  });

  if (!hrh) {
    throw new Error('Horário não encontrado');
  }

  if (hrh.status !== HrhStatus.RESERVED) {
    throw new Error('Horário não está reservado');
  }

  return await prisma.hrh.update({
    where: { id: hrhId },
    data: {
      status: HrhStatus.AVAILABLE,
      clienteId: null,
    },
  });
}

/**
 * Resetar horários expirados
 * Usado pelo worker/cron para atualizar status
 * Quando o horário passa e não foi usado, volta para disponível
 * Quando o horário passa e foi usado, marca como completo
 */
export async function resetExpiredHrh() {
  const now = new Date();

  // Buscar horários reservados ou disponíveis que já passaram
  const expiredHrhs = await prisma.hrh.findMany({
    where: {
      dataHora: { lt: now },
      status: { in: [HrhStatus.AVAILABLE, HrhStatus.RESERVED] },
    },
  });

  const results = [];

  for (const hrh of expiredHrhs) {
    if (hrh.status === HrhStatus.RESERVED) {
      // Se estava reservado, marca como completo e deduz horas
      const completed = await completeHrh(hrh.id);
      results.push({ id: hrh.id, action: 'completed', hrh: completed });
    } else {
      // Se estava disponível, remove o horário
      const deleted = await prisma.hrh.delete({
        where: { id: hrh.id },
      });
      results.push({ id: hrh.id, action: 'deleted', hrh: deleted });
    }
  }

  return results;
}

/**
 * Buscar horários disponíveis para um professor específico
 */
export async function getAvailableHrhByProfessor(professorId: number) {
  return await prisma.hrh.findMany({
    where: {
      professorId,
      status: HrhStatus.AVAILABLE,
      dataHora: { gte: new Date() }, // Apenas horários futuros
    },
    include: {
      professor: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { dataHora: 'asc' },
  });
}

/**
 * Buscar agenda do professor (todos os horários, organizados)
 */
export async function getProfessorAgenda(professorId: number) {
  return await prisma.hrh.findMany({
    where: {
      professorId,
      dataHora: { gte: new Date() }, // Apenas horários futuros
    },
    include: {
      professor: {
        select: { id: true, name: true, email: true },
      },
      cliente: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { dataHora: 'asc' },
  });
}
