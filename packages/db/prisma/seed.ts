import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cats = [
    { name: 'Whisky', slug: 'whisky' },
    { name: 'Rum', slug: 'rum' },
    { name: 'Vodka', slug: 'vodka' },
    { name: 'Beer', slug: 'beer' },
    { name: 'Wine', slug: 'wine' },
  ];
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  const whisky = await prisma.category.findUnique({ where: { slug: 'whisky' } });
  const beer = await prisma.category.findUnique({ where: { slug: 'beer' } });
  if (!whisky || !beer) return;

  await prisma.product.createMany({
    data: [
      { name: "McDowell's No.1 750ml", description: 'Smooth Indian whisky', price: 68000, image: 'https://picsum.photos/seed/whisky/400/600', stock: 50, categoryId: whisky.id },
      { name: 'Old Monk 750ml', description: 'Iconic dark rum', price: 56000, image: 'https://picsum.photos/seed/rum/400/600', stock: 60, categoryId: (await prisma.category.findUnique({ where: { slug: 'rum' } }))!.id },
      { name: 'Kingfisher Strong 650ml', description: 'Crisp lager', price: 19000, image: 'https://picsum.photos/seed/beer/400/600', stock: 200, categoryId: beer.id },
    ],
    skipDuplicates: true,
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
