import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <h1 className="text-4xl font-bold text-blue-900 sm:text-6xl">
        Bem-vindo ao Química Ensino Médio
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        Uma plataforma completa para seus estudos de química. Acesse aulas,
        slides, exercícios e materiais de apoio organizados por assunto.
      </p>
      <Link href="/assuntos">
        <Button className="text-lg px-8 py-4">Ver Conteúdos</Button>
      </Link>
    </div>
  );
}
