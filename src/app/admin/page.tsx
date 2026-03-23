import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao painel de gerenciamento de conteúdo.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assuntos</h2>
          <p className="text-gray-600 mb-6">
            Gerencie os temas e tópicos principais do site.
          </p>
          <Link href="/admin/assuntos">
            <Button className="w-full sm:w-auto">Gerenciar Assuntos</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aulas</h2>
          <p className="text-gray-600 mb-6">
            Crie, edite e publique conteúdos de aula e materiais.
          </p>
          <Link href="/admin/aulas">
            <Button className="w-full sm:w-auto">Gerenciar Aulas</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
