import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar admin
  const adminPassword = await bcrypt.hash('Mudar123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bravopanel.com' },
    update: {},
    create: {
      email: 'admin@bravopanel.com',
      passwordHash: adminPassword,
      name: 'Administrador',
      role: 'admin',
      status: 'active',
    },
  });

  console.log('Admin criado:', admin.email);

  // Criar algumas casas de apostas de exemplo
  const houses = [
    { name: 'BetMGM', cpaPercentage: 50, affiliateLink: 'https://betmgm.com/ref/' },
    { name: 'Novibet', cpaPercentage: 45, affiliateLink: 'https://novibet.com/ref/' },
    { name: 'SuperBet', cpaPercentage: 40, affiliateLink: 'https://superbet.com/ref/' },
    { name: 'LotusBet', cpaPercentage: 55, affiliateLink: 'https://lotusbet.com/ref/' },
  ];

  for (const house of houses) {
    const created = await prisma.bettingHouse.upsert({
      where: { id: house.name.toLowerCase().replace(/\s/g, '-') },
      update: house,
      create: {
        ...house,
        status: 'active',
      },
    });
    console.log('Casa criada:', created.name);
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
