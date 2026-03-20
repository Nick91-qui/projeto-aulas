import Link from "next/link";
import { Aula } from "@prisma/client";

type AulaCardProps = {
  aula: Aula;
  assuntoSlug: string;
};

export function AulaCard({ aula, assuntoSlug }: AulaCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <Link href={`/assuntos/${assuntoSlug}/${aula.slug}`} className="block">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          {aula.titulo}
        </h3>
        {aula.descricao && (
          <p className="text-gray-600 text-sm line-clamp-2">{aula.descricao}</p>
        )}
      </Link>
    </div>
  );
}
