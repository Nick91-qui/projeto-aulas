import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArquivoLink } from "@/components/aulas/ArquivoLink";
import Link from "next/link";

type Props = {
  params: { slug: string; aulaSlug: string };
};

export const revalidate = 60;

export default async function AulaPage({ params }: Props) {
  const aula = await prisma.aula.findFirst({
    where: {
      slug: params.aulaSlug,
      assunto: {
        slug: params.slug,
      },
      publicada: true,
    },
    include: {
      assunto: true,
      arquivos: true,
    },
  });

  if (!aula) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      <div className="mb-8">
        <Link
          href={`/assuntos/${params.slug}`}
          className="text-sm text-blue-600 hover:underline mb-2 block"
        >
          ← Voltar para {aula.assunto.nome}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{aula.titulo}</h1>
        <p className="text-gray-500 mt-2">
          Publicado em {new Date(aula.criadaEm).toLocaleDateString("pt-BR")}
        </p>
      </div>

      {aula.descricao && (
        <div className="prose max-w-none text-gray-700 bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
          <p>{aula.descricao}</p>
        </div>
      )}

      {aula.conteudo && (
        <div className="prose max-w-none">
          {/* Em um app real, usaríamos um renderizador de markdown aqui */}
          <div className="whitespace-pre-wrap">{aula.conteudo}</div>
        </div>
      )}

      {aula.arquivos.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Materiais de Apoio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aula.arquivos.map((arquivo) => (
              <ArquivoLink key={arquivo.id} arquivo={arquivo} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
