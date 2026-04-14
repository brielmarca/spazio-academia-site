import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar usuário admin se não existir
  const adminEmail = 'admin@spazio.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Usuário admin criado: admin@spazio.com / admin123');
  } else {
    console.log('✅ Usuário admin já existe');
  }

  console.log('🌱 Iniciando seed de planos...');

  const plans = [
    {
      name: 'musculacao',
      displayName: 'Musculação',
      description: 'Acesso ilimitado à sala de musculação com equipamentos de última geração.',
      price: 12990,
    },
    {
      name: 'pilates',
      displayName: 'Pilates',
      description: 'Aulas de Pilates com equipamentos e professores especializados.',
      price: 14990,
    },
    {
      name: 'funcional',
      displayName: 'Treino Funcional',
      description: 'Treinos dinâmicos que trabalham todo o corpo.',
      price: 11990,
    },
    {
      name: 'combo',
      displayName: 'Combo Completo',
      description: 'Acesso ilimitado a todas as modalidades: Musculação, Pilates e Funcional.',
      price: 19990,
    },
    {
      name: 'meio-periodo',
      displayName: 'Meio Período',
      description: 'Treine no período da manhã ou tarde. Flexibilidade para escolher seu melhor horário.',
      price: 8990,
    },
    {
      name: '5-dias',
      displayName: '5 Dias',
      description: 'Acesso de segunda a sexta. Ideal para quem quer manter uma rotina fixa de treino.',
      price: 9900,
    },
    {
      name: '7-dias',
      displayName: '7 Dias',
      description: 'Acesso completo todos os dias da semana. Treine quando quiser, sem limitações.',
      price: 14990,
    },
  ];

  for (const planData of plans) {
    const existing = await prisma.plan.findFirst({
      where: { name: planData.name },
    });

    if (existing) {
      await prisma.plan.update({
        where: { id: existing.id },
        data: planData,
      });
      console.log(`✅ Plano "${planData.displayName}" atualizado`);
    } else {
      await prisma.plan.create({
        data: planData,
      });
      console.log(`✅ Plano "${planData.displayName}" criado`);
    }
  }

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
