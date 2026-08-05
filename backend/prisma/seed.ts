import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CATEGORIA_SEED_DATA } from './categoriaSeedData';
import { FOCO_RADICAL_NOVAS_CATEGORIAS, FOCO_RADICAL_CATEGORIA_MAP } from './focoRadicalSeedData';

const prisma = new PrismaClient();

// Admin é só um Usuario com perfil=admin — não existe mais tabela separada.
async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;
  if (!email || !password) {
    console.warn('ADMIN_SEED_EMAIL/ADMIN_SEED_PASSWORD não definidos — nenhum admin criado.');
    return;
  }

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin já existe: ${email}`);
    return;
  }

  const senhaHash = await bcrypt.hash(password, 10);
  await prisma.usuario.create({ data: { nome: 'Admin', email, senhaHash, perfil: 'admin' } });
  console.log(`Admin criado: ${email}`);
}

async function seedProvedores(): Promise<{ potofId: number; fotopId: number; focoRadicalId: number }> {
  const potof = await prisma.provedor.upsert({
    where: { slug: 'potof' },
    update: {},
    create: { slug: 'potof', nome: 'Potof', descricao: 'Provedor próprio do potof.', proprio: true },
  });
  const fotop = await prisma.provedor.upsert({
    where: { slug: 'fotop' },
    update: {},
    create: {
      slug: 'fotop',
      nome: 'Fotop',
      descricao: 'fotop.com.br',
      urlSite: 'https://fotop.com.br',
      proprio: false,
    },
  });
  const focoRadical = await prisma.provedor.upsert({
    where: { slug: 'foco-radical' },
    update: {},
    create: { slug: 'foco-radical', nome: 'Foco Radical', proprio: false },
  });
  console.log('Provedores seed: Potof, Fotop, Foco Radical');
  return { potofId: potof.id, fotopId: fotop.id, focoRadicalId: focoRadical.id };
}

// Os ids em CATEGORIA_SEED_DATA são os códigos numéricos do fotop
// (id_estacoes) — ver comentário em categoriaSeedData.ts sobre por que
// Categoria.id fica alinhado a eles em vez de autoincrement livre.
async function seedCategorias(): Promise<void> {
  for (const item of CATEGORIA_SEED_DATA) {
    await prisma.categoria.upsert({
      where: { id: item.id },
      update: { slug: item.slug, nome: item.nome },
      create: { id: item.id, slug: item.slug, nome: item.nome },
    });
  }
  console.log(`Categorias seed: ${CATEGORIA_SEED_DATA.length}`);
}

// Mapeamento identidade pro Fotop: como Categoria.id já é o próprio código do
// fotop, idCategoriaProvedor é sempre igual a String(categoriaId). Trivial
// hoje, mas exercita o mesmo mecanismo que o sync de um futuro provedor com
// numeração diferente vai depender de verdade.
async function seedCategoriasProvedores(fotopId: number): Promise<void> {
  for (const item of CATEGORIA_SEED_DATA) {
    await prisma.categoriaProvedor.upsert({
      where: { categoriaId_provedorId: { categoriaId: item.id, provedorId: fotopId } },
      update: { idCategoriaProvedor: String(item.id) },
      create: { categoriaId: item.id, provedorId: fotopId, idCategoriaProvedor: String(item.id) },
    });
  }
  console.log(`Mapeamentos categoria-provedor (Fotop) seed: ${CATEGORIA_SEED_DATA.length}`);
}

// Categorias novas trazidas pelo catálogo do Foco Radical — ver comentário em
// focoRadicalSeedData.ts sobre por que elas não seguem o truque de id
// identidade usado pro Fotop.
async function seedFocoRadicalCategorias(): Promise<void> {
  for (const item of FOCO_RADICAL_NOVAS_CATEGORIAS) {
    await prisma.categoria.upsert({
      where: { id: item.id },
      update: { slug: item.slug, nome: item.nome },
      create: { id: item.id, slug: item.slug, nome: item.nome },
    });
  }
  console.log(`Categorias seed (Foco Radical): ${FOCO_RADICAL_NOVAS_CATEGORIAS.length}`);
}

async function seedCategoriasProvedoresFocoRadical(focoRadicalId: number): Promise<void> {
  for (const item of FOCO_RADICAL_CATEGORIA_MAP) {
    await prisma.categoriaProvedor.upsert({
      where: { categoriaId_provedorId: { categoriaId: item.categoriaId, provedorId: focoRadicalId } },
      update: { idCategoriaProvedor: item.idCategoriaProvedor },
      create: {
        categoriaId: item.categoriaId,
        provedorId: focoRadicalId,
        idCategoriaProvedor: item.idCategoriaProvedor,
      },
    });
  }
  console.log(`Mapeamentos categoria-provedor (Foco Radical) seed: ${FOCO_RADICAL_CATEGORIA_MAP.length}`);
}

async function main(): Promise<void> {
  await seedAdmin();
  const { fotopId, focoRadicalId } = await seedProvedores();
  await seedCategorias();
  await seedCategoriasProvedores(fotopId);
  await seedFocoRadicalCategorias();
  await seedCategoriasProvedoresFocoRadical(focoRadicalId);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
