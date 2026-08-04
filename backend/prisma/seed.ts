import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { EVENT_TYPES } from '../../frontend/src/data/eventTypes';

const prisma = new PrismaClient();

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_SEED_EMAIL/ADMIN_SEED_PASSWORD não definidos — nenhum admin criado.');
    return;
  }

  const existing = await prisma.adminUsuario.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin já existe: ${email}`);
    return;
  }

  const senhaHash = await bcrypt.hash(password, 10);
  await prisma.adminUsuario.create({ data: { nome: 'Admin', email, senhaHash } });
  console.log(`Admin criado: ${email}`);
}

async function seedProvedores(): Promise<void> {
  await prisma.provedor.upsert({
    where: { nome: 'Potof' },
    update: {},
    create: { nome: 'Potof', descricao: 'Provedor próprio do potof.', proprio: true },
  });
  await prisma.provedor.upsert({
    where: { nome: 'Fotop' },
    update: {},
    create: { nome: 'Fotop', descricao: 'fotop.com.br', urlSite: 'https://fotop.com.br', proprio: false },
  });
  console.log('Provedores seed: Potof, Fotop');
}

// Reaproveita a taxonomia de categorias já mantida para os filtros do site
// público (frontend/src/data/eventTypes.ts) em vez de recriá-la manualmente.
async function seedCategorias(): Promise<void> {
  for (const type of EVENT_TYPES) {
    await prisma.categoria.upsert({
      where: { slug: type.name },
      update: { nome: type.label },
      create: { slug: type.name, nome: type.label },
    });
  }
  console.log(`Categorias seed: ${EVENT_TYPES.length}`);
}

async function main(): Promise<void> {
  await seedAdmin();
  await seedProvedores();
  await seedCategorias();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
