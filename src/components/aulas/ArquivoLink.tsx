import { Arquivo } from "@prisma/client";

type ArquivoLinkProps = {
  arquivo: Arquivo;
};

export function ArquivoLink({ arquivo }: ArquivoLinkProps) {
  const icons: Record<string, string> = {
    slides: "📊",
    texto: "📄",
    exercicio: "📝",
    imagem: "🖼️",
  };

  return (
    <a
      href={arquivo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors group"
    >
      <span className="text-2xl mr-3" role="img" aria-label={arquivo.tipo}>
        {icons[arquivo.tipo] || "📎"}
      </span>
      <div>
        <p className="font-medium text-blue-800 group-hover:underline">
          {arquivo.nome}
        </p>
        <span className="text-xs text-gray-500 uppercase">{arquivo.tipo}</span>
      </div>
    </a>
  );
}
