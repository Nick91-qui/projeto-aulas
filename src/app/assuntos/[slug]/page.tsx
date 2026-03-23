// src/app/assuntos/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

// Força a renderização dinâmica para garantir dados atualizados do banco
export const dynamic = "force-dynamic";

export default async function AssuntoPage({
  params,
}: {
  params: { slug: string };
}) {
  const assunto = await prisma.assunto
    .findMany({
      where: { slug: params.slug },
      include: {
        aulas: {
          where: { publicada: true }, // Apenas aulas publicadas aparecem
          orderBy: { ordem: "asc" },
        },
      },
    })
    .then((res) => res[0]); // findUnique às vezes falha com slug se não for @unique no prisma schema exato, findMany é mais seguro aqui ou garanta que slug é unique

  if (!assunto) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/assuntos"
          className="text-blue-600 hover:underline text-sm w-fit"
        >
          &larr; Voltar para Assuntos
        </Link>
        <h1 className="text-3xl font-bold text-blue-900">{assunto.nome}</h1>
        {assunto.descricao && (
          <p className="text-gray-600 text-lg">{assunto.descricao}</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Aulas disponíveis
        </h2>
        {assunto.aulas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {assunto.aulas.map((aula) => (
              <Link
                key={aula.id}
                href={`/assuntos/${assunto.slug}/${aula.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white hover:border-blue-300"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg text-blue-800">
                    {aula.titulo}
                  </span>
                  <Badge variant="neutral">Aula</Badge>
                </div>
                {aula.descricao && (
                  <p className="text-gray-600 mt-2">{aula.descricao}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500 italic">
              Nenhuma aula publicada para este assunto ainda.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              (Verifique se as aulas estão marcadas como &quot;publicada:
              true&quot; no banco de dados)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
