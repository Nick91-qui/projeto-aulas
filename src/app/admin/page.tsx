import { getServerSession } from "next-auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Busca contagens para o resumo (executa em paralelo para performance)
  const [subjectsCount, lessonsCount, publishedLessonsCount] =
    await Promise.all([
      prisma.assunto.count(),
      prisma.aula.count(),
      prisma.aula.count({ where: { publicada: true } }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Painel Administrativo
        </h1>
        <p className="mt-2 text-gray-600">
          Olá, <span className="font-semibold">{session?.user?.email}</span>.
          Bem-vindo de volta!
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Assuntos
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-800">
            {subjectsCount}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Total de Aulas
          </p>
          <p className="mt-2 text-3xl font-bold text-blue-800">
            {lessonsCount}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 uppercase">
            Aulas Publicadas
          </p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {publishedLessonsCount}
          </p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/assuntos"
          className="group block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
            Gerenciar Assuntos &rarr;
          </h3>
          <p className="mt-2 text-gray-600">
            Organize os temas e assuntos do currículo de Química.
          </p>
        </Link>

        <Link
          href="/admin/aulas"
          className="group block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
            Gerenciar Aulas &rarr;
          </h3>
          <p className="mt-2 text-gray-600">
            Crie novas aulas, adicione materiais e publique conteúdo.
          </p>
        </Link>
      </div>
    </div>
  );
}
