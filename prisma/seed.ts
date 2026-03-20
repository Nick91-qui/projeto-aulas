import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const assunto = await prisma.assunto.upsert({
    where: { slug: "ligacoes-quimicas" },
    update: {},
    create: {
      slug: "ligacoes-quimicas",
      nome: "Ligações Químicas",
      descricao: "Entenda como os átomos se unem para formar compostos.",
      ordem: 1,
      aulas: {
        create: {
          slug: "ligacoes-ionicas",
          titulo: "Ligações Iônicas",
          descricao: "Transferência de elétrons entre metais e não-metais.",
          conteudo:
            "As ligações iônicas ocorrem quando há transferência definitiva de elétrons...",
          publicada: true,
          ordem: 1,
        },
      },
    },
  });

  console.log({ assunto });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
