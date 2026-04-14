// src/main/services/plan.service.ts
import { prisma } from '../prisma';
import { CreatePlanInput } from '../types';

/**
 * Criar um novo plano
 */
export async function createPlan(data: CreatePlanInput) {
  const plan = await prisma.plan.create({
    data: {
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      price: data.price,
      abacatepayPlanId: data.abacatepayPlanId,
    },
  });

  return plan;
}

/**
 * Listar todos os planos ativos
 */
export async function getAllPlans(includeInactive = false) {
  const plans = await prisma.plan.findMany({
    where: includeInactive ? undefined : { isActive: true },
    orderBy: { price: 'asc' },
  });

  return plans;
}

/**
 * Buscar plano por ID
 */
export async function getPlanById(id: number) {
  const plan = await prisma.plan.findUnique({
    where: { id },
  });

  if (!plan) {
    throw new Error('Plano não encontrado');
  }

  return plan;
}

/**
 * Buscar plano por nome
 */
export async function getPlanByName(name: string) {
  const plan = await prisma.plan.findFirst({
    where: { name },
  });

  return plan;
}

/**
 * Atualizar plano
 */
export async function updatePlan(
  id: number,
  data: Partial<CreatePlanInput>
) {
  const plan = await prisma.plan.update({
    where: { id },
    data,
  });

  return plan;
}

/**
 * Desativar plano
 */
export async function deactivatePlan(id: number) {
  const plan = await prisma.plan.update({
    where: { id },
    data: { isActive: false },
  });

  return plan;
}

/**
 * Ativar plano
 */
export async function activatePlan(id: number) {
  const plan = await prisma.plan.update({
    where: { id },
    data: { isActive: true },
  });

  return plan;
}

/**
 * Deletar plano (hard delete - use com cuidado)
 */
export async function deletePlan(id: number) {
  await prisma.plan.delete({
    where: { id },
  });

  return { message: 'Plano deletado com sucesso' };
}

/**
 * Seed de planos padrão
 * Executar na primeira vez para criar os planos básicos
 */
export async function seedDefaultPlans() {
  const defaultPlans = [
    {
      name: 'musculacao',
      displayName: 'Musculação',
      description: 'Acesso ilimitado à sala de musculação com equipamentos de última geração.',
      price: 12990, // R$ 129,90
    },
    {
      name: 'pilates',
      displayName: 'Pilates',
      description: 'Aulas de Pilates com equipamentos e professores especializados.',
      price: 14990, // R$ 149,90
    },
    {
      name: 'funcional',
      displayName: 'Treino Funcional',
      description: 'Treinos dinâmicos que trabalham todo o corpo.',
      price: 11990, // R$ 119,90
    },
    {
      name: 'combo',
      displayName: 'Combo Completo',
      description: 'Acesso ilimitado a todas as modalidades: Musculação, Pilates e Funcional.',
      price: 19990, // R$ 199,90
    },
    {
      name: 'meio-periodo',
      displayName: 'Meio Período',
      description: 'Treine no período da manhã ou tarde. Flexibilidade para escolher seu melhor horário.',
      price: 8990, // R$ 89,90
    },
    {
      name: '5-dias',
      displayName: '5 Dias',
      description: 'Acesso de segunda a sexta. Ideal para quem quer manter uma rotina fixa de treino.',
      price: 9900, // R$ 99,00
    },
    {
      name: '7-dias',
      displayName: '7 Dias',
      description: 'Acesso completo todos os dias da semana. Treine quando quiser, sem limitações.',
      price: 14990, // R$ 149,90
    },
  ];

  for (const planData of defaultPlans) {
    const existing = await prisma.plan.findFirst({
      where: { name: planData.name },
    });

    if (!existing) {
      await prisma.plan.create({
        data: planData,
      });
      console.log(`✅ Plano "${planData.displayName}" criado`);
    }
  }

  console.log('✅ Seed de planos concluído');
}
