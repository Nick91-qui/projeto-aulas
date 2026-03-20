import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export const revalidate = 60; // Revalida a cada 60 segundos (ISR)

export default async function AssuntosPage() {
  const assuntos = await prisma.assunto.findMany({
    orderBy: { ordem: "asc" },
    include: {
      _count: {
        select: { aulas: { where: { publicada: true } } },
      },
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-900">Assuntos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assuntos.map((assunto) => (
          <Link
            key={assunto.id}
            href={`/assuntos/${assunto.slug}`}
            className="block group"
          >
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all bg-white h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-blue-800 group-hover:text-blue-600 transition-colors">
                  {assunto.nome}
                </h2>
                <Badge variant="neutral">{assunto._count.aulas} aulas</Badge>
              </div>
              <p className="text-gray-600 flex-grow">
                {assunto.descricao || "Sem descrição."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
