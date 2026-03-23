import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AulaCard } from "@/components/aulas/AulaCard";
import { Badge } from "@/components/ui/Badge";

type Props = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function AssuntoPage({ params }: Props) {
  const assunto = await prisma.assunto.findUnique({
    where: { slug: params.slug },
    include: {
      aulas: {
        where: { publicada: true },
        orderBy: { ordem: "asc" },
      },
    },
  });

  if (!assunto) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
        <h1 className="text-3xl font-bold text-blue-900 mb-4">
          {assunto.nome}
        </h1>
        {assunto.descricao && (
          <p className="text-lg text-gray-700">{assunto.descricao}</p>
        )}
        <div className="mt-4">
          <Badge variant="neutral">
            {assunto.aulas.length} aulas disponíveis
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assunto.aulas.map((aula) => (
          <AulaCard key={aula.id} aula={aula} assuntoSlug={assunto.slug} />
        ))}
        {assunto.aulas.length === 0 && (
          <p className="text-gray-500 italic col-span-full">
            Nenhuma aula publicada neste assunto ainda.
          </p>
        )}
      </div>
    </div>
  );
}
