import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

// Força a renderização dinâmica para garantir que novos dados (seed) apareçam imediatamente
export const dynamic = "force-dynamic";

export default async function AssuntosPage() {
  const assuntos = await prisma.assunto.findMany({
    orderBy: { ordem: "asc" },
    include: {
      aulas: {
        where: { publicada: true },
        select: { id: true }, // Seleciona apenas o ID para contagem
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-blue-900">Assuntos</h1>
        <p className="text-gray-600 text-lg">
          Navegue pelos temas de química disponíveis.
        </p>
      </div>

      {assuntos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assuntos.map((assunto) => (
            <Link
              key={assunto.id}
              href={`/assuntos/${assunto.slug}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow hover:border-blue-300 group h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-blue-800 group-hover:text-blue-600 transition-colors">
                  {assunto.nome}
                </h2>
                {assunto.aulas.length > 0 && (
                  <Badge variant="neutral">{assunto.aulas.length} aulas</Badge>
                )}
              </div>
              {assunto.descricao && (
                <p className="text-gray-600 line-clamp-3">
                  {assunto.descricao}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-100 min-h-[200px]">
          <p className="text-xl text-gray-500 italic mb-2">
            Nenhum assunto encontrado.
          </p>
          <p className="text-sm text-gray-400">
            (Execute <code>npm run docker:prisma:seed</code> para popular o
            banco)
          </p>
        </div>
      )}
    </div>
  );
}
