import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");
  console.log(`DATABASE_URL definida: ${!!process.env.DATABASE_URL}`);

  // Limpar dados antigos para garantir um estado limpo
  await prisma.arquivo.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.assunto.deleteMany();

  console.log("Banco de dados limpo.");

  // Criar Assunto: Química Geral
  const assunto = await prisma.assunto.create({
    data: {
      nome: "Química Geral",
      slug: "quimica-geral",
      descricao:
        "Conceitos fundamentais da química, estrutura da matéria e reações.",
      ordem: 1,
    },
  });

  console.log(`✅ Assunto criado: ${assunto.nome} (ID: ${assunto.id})`);

  // Criar Aula 1
  await prisma.aula.create({
    data: {
      titulo: "Introdução à Matéria",
      slug: "introducao-materia",
      descricao: "Definição de matéria, massa e volume. Estados físicos.",
      conteudo:
        "# Introdução à Matéria\n\nMatéria é tudo aquilo que tem massa e ocupa lugar no espaço.",
      publicada: true,
      ordem: 1,
      assuntoId: assunto.id,
    },
  });
  console.log("✅ Aula 1 criada");

  // Criar Aula 2
  await prisma.aula.create({
    data: {
      titulo: "Estrutura Atômica",
      slug: "estrutura-atomica",
      descricao: "Prótons, nêutrons e elétrons. Modelos atômicos.",
      conteudo: "# O Átomo\n\nA unidade básica da matéria.",
      publicada: true,
      ordem: 2,
      assuntoId: assunto.id,
    },
  });
  console.log("✅ Aula 2 criada");

  console.log("🚀 Seed finalizado com sucesso!");
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
